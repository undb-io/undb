import { executionContext } from "@undb/context/server"
import { inject, singleton } from "@undb/di"
import { None, Option, Some, type PaginatedDTO } from "@undb/domain"
import {
  AUTO_INCREMENT_TYPE,
  ID_TYPE,
  SelectField,
  TableIdVo,
  injectTableRepository,
  type AggregateResult,
  type CountQueryArgs,
  type Field,
  type IGetPivotDataOutput,
  type IPivotAggregate,
  type IRecordDTO,
  type IRecordQueryRepository,
  type ITableRepository,
  type IViewAggregate,
  type IViewSort,
  type QueryArgs,
  type RecordId,
  type SingleQueryArgs,
  type TableDo,
  type TableId,
  type View,
  type ViewId,
} from "@undb/table"
import { getTableName } from "drizzle-orm"
import { sql, type AliasedExpression, type Expression, type ExpressionBuilder } from "kysely"
import type { IRecordQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { users } from "../tables"
import { UnderlyingTable } from "../underlying/underlying-table"
import { RecordQueryHelper } from "./record-query.helper"
import { RecordReferenceVisitor } from "./record-reference-visitor"
import { RecordSpecReferenceVisitor } from "./record-spec-reference-visitor"
import { getRecordDTOFromEntity } from "./record-utils"
import { AggregateFnBuiler } from "./record.aggregate-builder"
import { RecordMapper } from "./record.mapper"

@singleton()
export class RecordQueryRepository implements IRecordQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IRecordQueryBuilder,
    @inject(RecordMapper)
    private readonly mapper: RecordMapper,
    @injectTableRepository()
    private readonly tableRepo: ITableRepository,
    @inject(RecordQueryHelper)
    private readonly helper: RecordQueryHelper,
  ) {}

  async count(tableId: TableId): Promise<number> {
    const { total } = await this.qb
      .selectFrom(tableId.value)
      .select((eb) => eb.fn.countAll().as("total"))
      .executeTakeFirstOrThrow()

    return Number(total)
  }

  async countWhere(table: TableDo, query: Option<CountQueryArgs>): Promise<number> {
    const t = new UnderlyingTable(table)

    const spec = Option(query.into(undefined)?.filter.into(undefined))

    const { total } = await this.qb
      .selectFrom(t.name)
      .select((eb) => eb.fn.countAll().as("total"))
      .where(this.helper.handleWhere(table, spec))
      .executeTakeFirstOrThrow()

    return Number(total)
  }

  private async getForeignTables(table: TableDo, fields: Field[]): Promise<Map<string, TableDo>> {
    const map = new Map<string, TableDo>()

    const foriengTableIds = table.schema.getForeignTableIds(fields)
    const foreignTables = await this.tableRepo.findManyByIds([...foriengTableIds].map((id) => new TableIdVo(id)))
    for (const foreignTable of foreignTables) {
      map.set(foreignTable.id.value, foreignTable)
    }

    return map
  }

  async findOneById(table: TableDo, id: RecordId, query: Option<SingleQueryArgs>): Promise<Option<IRecordDTO>> {
    const q = query.into(undefined)
    const select = q?.select.into(undefined)
    const view = q?.ignoreView ? undefined : q?.view

    const selectFields = table.getSelectFields(view, select)

    const foreignTables = await this.getForeignTables(table, selectFields)
    const qb = this.helper.createQuery(table, foreignTables, selectFields, None)

    const result = await qb.where(`${table.id.value}.${ID_TYPE}`, "=", id.value).executeTakeFirst()

    return result ? Some(getRecordDTOFromEntity(table, result, foreignTables)) : None
  }

  async find(table: TableDo, view: View, query: Option<QueryArgs>): Promise<PaginatedDTO<IRecordDTO>> {
    const context = executionContext.getStore()
    const userId = context?.user?.userId!

    const t = new UnderlyingTable(table)

    const filter = query.into(undefined)?.filter.into(undefined)
    const defaultSort: IViewSort = [{ fieldId: AUTO_INCREMENT_TYPE, direction: "asc" }]
    const ignoreView = query.into(undefined)?.ignoreView
    const sort = ignoreView ? defaultSort : (view.sort.into(undefined)?.value ?? defaultSort)

    const spec = table.getQuerySpec({ ignoreView, viewId: view.id.value, userId, filter })
    const pagination = query.into(undefined)?.pagination.into(undefined)
    const select = query.into(undefined)?.select.into(undefined)

    const selectFields = table.getSelectFields(ignoreView ? undefined : view, select)
    const foreignTables = await this.getForeignTables(table, selectFields)
    const qb = this.helper.createQuery(table, foreignTables, selectFields, spec)

    const result = await qb
      .$if(!!pagination?.limit, this.helper.handlePagination(pagination!))
      .$if(!!sort, this.helper.handleSort(table, sort))
      .where(this.helper.handleWhere(table, spec))
      .execute()

    const total = await this.countWhere(table, Some({ filter: spec }))

    const records = result.map((r) => getRecordDTOFromEntity(table, r, foreignTables))
    return { values: records, total: Number(total) }
  }

  async getPivotData(table: TableDo, viewId: string): Promise<IGetPivotDataOutput> {
    const view = table.views.getViewById(viewId)

    if (view.type !== "pivot") {
      throw new Error("Invalid view type")
    }
    if (!view.isValid) {
      throw new Error("Invalid view")
    }

    const columnLabel = view.columnLabel.unwrap()!
    const rowLabel = view.rowLabel.unwrap()!
    const value = view.value.unwrap()!
    const aggregate = view.pivotAggregate.unwrap()!

    const columnField = table.schema.getFieldByIdOrName(columnLabel).into(undefined) as SelectField | undefined
    const rowField = table.schema.getFieldByIdOrName(rowLabel).into(undefined)
    const valueField = table.schema.getFieldByIdOrName(value).into(undefined)
    if (!columnField || !rowField) {
      throw new Error("Invalid view")
    }

    function convertAggFn(aggFn: IPivotAggregate) {
      aggFn = aggFn.toLowerCase() as IPivotAggregate
      if (aggFn === "average") {
        return "avg"
      }
      return aggFn
    }

    const options = columnField.options
    const aggFn = convertAggFn(aggregate)

    const t = new UnderlyingTable(table)
    const createSelects =
      (isTotal = false) =>
      (eb: ExpressionBuilder<any, any>) => {
        const selects: AliasedExpression<any, any>[] = [
          isTotal ? sql.raw("'Total'").as("label") : eb.ref(`${t.name}.${rowField.id.value}`).as("label"),
        ]

        if (rowField.type === "user") {
          if (!isTotal) {
            const user = getTableName(users)

            const q = eb
              .selectFrom(user)
              .select(
                eb
                  .fn("json_object", [
                    sql.raw("'username'"),
                    eb.fn.coalesce(`${user}.${users.username.name}`, sql`NULL`),
                    sql.raw("'email'"),
                    eb.fn.coalesce(`${user}.${users.email.name}`, sql`NULL`),
                  ])
                  .as("labelValues"),
              )
              .whereRef(rowField.id.value, "=", `${user}.${users.id.name}`)
              .limit(1)
              .as("labelValues")

            selects.push(q)
          } else {
            selects.push(sql`NULL`.as("labelValues"))
          }
        }

        const columnSelects = options
          .map((option) => {
            if (aggFn === "count") {
              const caseString = `count(CASE WHEN "${t.name}"."${columnField.id.value}" = '${option.id}' THEN 1 END)`
              return [sql.raw(`'${option.name}'`), sql.raw(caseString)]
            } else {
              if (!valueField) {
                throw new Error("value field is required")
              }

              let valueFieldAlias = `${t.name}.${valueField.id.value}`
              if (valueField.type === "currency") {
                valueFieldAlias = `${t.name}.${valueField.id.value} / 100`
              }

              const caseString =
                `${aggFn}(CASE WHEN ` +
                `"${t.name}"."${columnField.id.value}" = '${option.id}' ` +
                `THEN ${valueFieldAlias} ` +
                `END)`
              return [sql.raw(`'${option.name}'`), sql.raw(caseString)]
            }
          })
          .flat()

        selects.push(eb.fn("json_object", columnSelects).as("values"))

        if (aggFn === "count") {
          selects.push(sql.raw(`sum(CASE WHEN "${t.name}"."${columnField.id.value}" IS NOT NULL THEN 1 END)`).as(`agg`))
        } else {
          if (!valueField) {
            throw new Error("value field is required")
          }
          const rowTotalString =
            valueField.type === "currency"
              ? `${aggFn}("${t.name}"."${valueField.id.value}") / 100`
              : `${aggFn}("${t.name}"."${valueField.id.value}")`
          selects.push(sql.raw(rowTotalString).as(`agg`))
        }

        return selects
      }

    const result = await this.qb
      .selectFrom(t.name)
      .select(createSelects())
      .groupBy(`${t.name}.${rowField.id.value}`)
      .unionAll((qb) => qb.selectFrom(t.name).select(createSelects(true)))
      .execute()

    return result as IGetPivotDataOutput
  }

  async aggregate(
    table: TableDo,
    viewId: Option<ViewId>,
    aggregate: Option<IViewAggregate>,
    query: Option<QueryArgs>,
  ): Promise<Record<string, AggregateResult>> {
    const context = executionContext.getStore()
    const userId = context?.user?.userId!

    const t = new UnderlyingTable(table)
    const view = table.views.getViewById(viewId.into(undefined)?.value)
    if (aggregate.isNone()) {
      const aggregates = view.aggregate
      if (aggregates.isNone()) {
        return {}
      }
      const aggs = aggregates.unwrap()
      if (aggs.isEmpty()) {
        return {}
      }

      aggregate = Some(aggs.toJSON())
    }
    if (aggregate.isNone()) {
      return {}
    }

    const filter = query.into(undefined)?.filter.into(undefined)
    const spec = table.getQuerySpec({ viewId: view.id.value, userId, filter })

    const select = query.into(undefined)?.select.into(undefined)
    const selectFields = table.getSelectFields(view, select)

    const foreignTables = await this.getForeignTables(table, selectFields)
    const qb = this.helper.createQueryCreator(table, foreignTables, selectFields, spec)

    const result = await qb
      .selectFrom(t.name)
      .$call((qb) => new RecordReferenceVisitor(qb, table).join(selectFields))
      .$call((qb) => {
        const visitor = new RecordSpecReferenceVisitor(qb, table)
        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }
        return visitor.join()
      })
      .select((eb) => {
        const ebs: AliasedExpression<any, any>[] = []

        for (const [fieldId, fieldAggregate] of Object.entries(aggregate.unwrap())) {
          if (!fieldAggregate) {
            continue
          }
          const field = table.schema.fieldMapById.get(fieldId)
          if (!field) {
            continue
          }
          const builder = new AggregateFnBuiler(t, eb, field, fieldAggregate)
          ebs.push(builder.build())
        }
        return ebs
      })
      .where(this.helper.handleWhere(table, spec))
      .where((eb) => {
        const ebs: Expression<any>[] = []

        for (const [fieldId, fieldAggregate] of Object.entries(aggregate.unwrap())) {
          if (!fieldAggregate) {
            continue
          }

          const field = table.schema.fieldMapById.get(fieldId)
          if (!field) {
            continue
          }
          // const builder = new AggregateFnBuiler(t, eb, field, fieldAggregate)
          // const expr = builder.handleWhere()
          // if (expr.isSome()) {
          //   ebs.push(expr.unwrap())
          // }
        }

        return eb.and(ebs)
      })
      .executeTakeFirst()

    return result ?? {}
  }
}
