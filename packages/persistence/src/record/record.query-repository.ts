import { executionContext } from "@undb/context/server"
import { inject, singleton } from "@undb/di"
import { None, Option, Some, andOptions, type PaginatedDTO } from "@undb/domain"
import {
  FieldIdVo,
  ID_TYPE,
  RecordComositeSpecification,
  TableIdVo,
  injectTableRepository,
  type AggregateResult,
  type Field,
  type IRecordDTO,
  type IRecordQueryRepository,
  type ITableRepository,
  type QueryArgs,
  type RecordId,
  type TableDo,
  type TableId,
  type ViewId,
} from "@undb/table"
import { type AliasedExpression, type ExpressionBuilder, type SelectQueryBuilder } from "kysely"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTable } from "../underlying/underlying-table"
import { RecordQueryCreatorVisitor } from "./record-query-creator-visitor"
import { RecordReferenceVisitor } from "./record-reference-visitor"
import { RecordSelectFieldVisitor } from "./record-select-field-visitor"
import { getRecordDTOFromEntity } from "./record-utils"
import { AggregateFnBuiler } from "./record.aggregate-builder"
import { RecordFilterVisitor } from "./record.filter-visitor"
import { RecordMapper } from "./record.mapper"

@singleton()
export class RecordQueryRepository implements IRecordQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @inject(RecordMapper)
    private readonly mapper: RecordMapper,
    @injectTableRepository()
    private readonly tableRepo: ITableRepository,
  ) {}

  async count(tableId: TableId): Promise<number> {
    const { total } = await this.qb
      .selectFrom(tableId.value)
      .select((eb) => eb.fn.countAll().as("total"))
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

  private createQuery(table: TableDo, foreignTables: Map<string, TableDo>, visibleFields: Field[]) {
    const t = new UnderlyingTable(table)
    const qb = new RecordQueryCreatorVisitor(this.qb, table, foreignTables, visibleFields).create()

    return qb
      .selectFrom(table.id.value)
      .$call((qb) => new RecordReferenceVisitor(qb, table).join(visibleFields))
      .select((sb) => new RecordSelectFieldVisitor(t, foreignTables, sb).$select(visibleFields))
  }

  async findOneById(table: TableDo, id: RecordId): Promise<Option<IRecordDTO>> {
    const visibleFields = table.getOrderedVisibleFields()
    const foreignTables = await this.getForeignTables(table, visibleFields)
    const qb = this.createQuery(table, foreignTables, visibleFields)

    const result = await qb.where(`${table.id.value}.${ID_TYPE}`, "=", id.value).executeTakeFirst()

    return result ? Some(getRecordDTOFromEntity(table, result)) : None
  }

  private handleWhere(table: TableDo, spec: Option<RecordComositeSpecification>) {
    return (eb: ExpressionBuilder<any, any>) => {
      const visitor = new RecordFilterVisitor(eb, table)
      if (spec?.isSome()) {
        spec.unwrap().accept(visitor)
      }
      return visitor.cond
    }
  }

  async find(table: TableDo, viewId: Option<ViewId>, query: Option<QueryArgs>): Promise<PaginatedDTO<IRecordDTO>> {
    const context = executionContext.getStore()
    const userId = context?.user?.userId!

    const t = new UnderlyingTable(table)
    const view = table.views.getViewById(viewId.into(undefined)?.value)
    const schema = table.schema

    const viewSpec = view.filter.map((f) => f.getSpec(schema)).flatten()
    const rlsSpec = table.rls.map((r) => r.getSpec(schema, "read", userId)).flatten()

    const filter = query.into(undefined)?.filter.into(undefined)
    const sort = view.sort.into(undefined)?.value

    const spec = andOptions(rlsSpec, viewSpec, Option(filter)) as Option<RecordComositeSpecification>
    const pagination = query.into(undefined)?.pagination.into(undefined)
    const select = query.into(undefined)?.select.into(undefined)

    const handlePagination = (qb: SelectQueryBuilder<any, any, any>) => {
      const limit = pagination!.limit as number
      return qb.limit(limit).offset(((pagination?.page ?? 1) - 1) * limit)
    }

    const handleSort = (qb: SelectQueryBuilder<any, any, any>) => {
      return sort!.reduce((qb, s) => qb.orderBy(`${s.fieldId} ${s.direction}`), qb)
    }

    const selectFields = select
      ? select.map((f) => table.schema.getFieldById(new FieldIdVo(f)).into(undefined)).filter((f) => !!f)
      : table.getOrderedVisibleFields(view.id.value)
    const foreignTables = await this.getForeignTables(table, selectFields)
    const qb = this.createQuery(table, foreignTables, selectFields)

    const result = await qb
      .$if(!!pagination?.limit, handlePagination)
      .$if(!!sort, handleSort)
      .where(this.handleWhere(table, spec))
      .execute()

    // TODO: move total to aggregate result
    const { total } = await this.qb
      .selectFrom(t.name)
      .select((eb) => eb.fn.countAll().as("total"))
      .where(this.handleWhere(table, spec))
      .executeTakeFirstOrThrow()

    const records = result.map((r) => getRecordDTOFromEntity(table, r))
    return { values: records, total: Number(total) }
  }

  async aggregate(table: TableDo, viewId: Option<ViewId>): Promise<Record<string, AggregateResult>> {
    const t = new UnderlyingTable(table)
    const view = table.views.getViewById(viewId.into(undefined)?.value)
    const aggregates = view.aggregate
    if (aggregates.isNone()) {
      return {}
    }
    if (aggregates.unwrap().isEmpty()) {
      return {}
    }

    const viewSpec = Option(
      view.filter.into(undefined)?.getSpec(table.schema).into(undefined),
    ) as Option<RecordComositeSpecification>

    const result = await this.qb
      .selectFrom(t.name)
      .select((eb) => {
        const ebs: AliasedExpression<any, any>[] = []

        for (const [fieldId, fieldAggregate] of aggregates.unwrap()) {
          if (!fieldAggregate) {
            continue
          }
          const field = table.schema.fieldMapById.get(fieldId)
          if (!field) {
            continue
          }
          const builder = new AggregateFnBuiler(eb, field, fieldAggregate)
          ebs.push(builder.build())
        }
        return ebs
      })
      .where(this.handleWhere(table, viewSpec))
      .executeTakeFirst()

    return result ?? {}
  }
}
