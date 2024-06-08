import { executionContext } from "@undb/context/server"
import { inject, singleton } from "@undb/di"
import { None, Option, Some, andOptions, type PaginatedDTO } from "@undb/domain"
import {
  ID_TYPE,
  RecordComositeSpecification,
  type AggregateResult,
  type Field,
  type IRecordDTO,
  type IRecordQueryRepository,
  type QueryArgs,
  type RecordId,
  type TableDo,
  type TableId,
  type ViewId,
} from "@undb/table"
import { type AliasedExpression, type ExpressionBuilder, type SelectQueryBuilder } from "kysely"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { JoinTable } from "../underlying/reference/join-table"
import { UnderlyingTable } from "../underlying/underlying-table"
import { RecordSelectFieldVisitor } from "./record-select-field-visitor"
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
  ) {}

  async count(tableId: TableId): Promise<number> {
    const { total } = await this.qb
      .selectFrom(tableId.value)
      .select((eb) => eb.fn.countAll().as("total"))
      .executeTakeFirstOrThrow()

    return Number(total)
  }

  async findOneById(table: TableDo, id: RecordId): Promise<Option<IRecordDTO>> {
    const t = new UnderlyingTable(table)
    const fields = table.getOrderedVisibleFields()
    const result = await this.qb
      .selectFrom(t.name)
      .select(this.handleSelect(table, fields))
      .where(ID_TYPE, "=", id.value)
      .executeTakeFirst()

    return result ? Some(this.mapper.toDTO(result)) : None
  }

  private handleQuery(spec: Option<RecordComositeSpecification>) {
    return (eb: ExpressionBuilder<any, any>) => {
      const visitor = new RecordFilterVisitor(eb)
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
    const view = table.views.getViewById(viewId.into(undefined))
    const schema = table.schema
    const fields = table.getOrderedVisibleFields(view.id)

    const viewSpec = view.filter.map((f) => f.getSpec(schema)).flatten()
    const rlsSpec = table.rls.map((r) => r.getSpec(schema, "read", userId)).flatten()

    const filter = query.into(undefined)?.filter.into(undefined)
    const sort = view.sort.into(undefined)?.value

    const spec = andOptions(rlsSpec, viewSpec, Option(filter)) as Option<RecordComositeSpecification>
    const pagination = query.into(undefined)?.pagination.into(undefined)

    const handlePagination = (qb: SelectQueryBuilder<any, any, any>) => {
      const limit = pagination!.limit as number
      return qb.limit(limit).offset(((pagination?.page ?? 1) - 1) * limit)
    }

    const handleSort = (qb: SelectQueryBuilder<any, any, any>) => {
      return sort!.reduce((qb, s) => qb.orderBy(`${s.fieldId} ${s.direction}`), qb)
    }

    const handleSelect = this.handleSelect(table, fields)

    const referenceFields = schema.getReferenceFields(fields)

    // TODO: move to other file or method
    const qb = referenceFields.reduce((qb, field) => {
      const joinTable = new JoinTable(table, field)
      return qb.with(field.id.value, (db) => {
        return db
          .selectFrom(joinTable.getTableName())
          .innerJoin(
            field.foreignTableId,
            `${joinTable.getTableName()}.${joinTable.getSymmetricFieldId()}`,
            `${field.foreignTableId}.id`,
          )
          .select((sb) => [
            `${joinTable.getTableName()}.${joinTable.getFieldId()} as ${ID_TYPE}`,
            sb.fn("json_group_array", [sb.ref(`${joinTable.getTableName()}.${joinTable.getFieldId()}`)]).as("ids"),
          ])
          .groupBy(`${joinTable.getTableName()}.${joinTable.getFieldId()}`)
      })
    }, this.qb)

    const result = await qb
      .selectFrom(t.name)
      .$call((qb) =>
        referenceFields.reduce((qb, field) => qb.leftJoin(field.id.value, `${t.name}.id`, `${field.id.value}.id`), qb),
      )
      .select(handleSelect)
      .$if(!!pagination?.limit, handlePagination)
      .$if(!!sort, handleSort)
      .where(this.handleQuery(spec))
      .execute()

    // TODO: move total to aggregate result
    const { total } = await this.qb
      .selectFrom(t.name)
      .select((eb) => eb.fn.countAll().as("total"))
      .where(this.handleQuery(spec))
      .executeTakeFirstOrThrow()

    console.log(result)

    const records = result.map((r) => this.mapper.toDTO(r))
    return { values: records, total: Number(total) }
  }

  private handleSelect(table: TableDo, fields: Field[]) {
    return (sb: ExpressionBuilder<any, any>) => {
      const visitor = new RecordSelectFieldVisitor(new UnderlyingTable(table), this.qb, sb)
      for (const field of fields) {
        field.accept(visitor)
      }
      return visitor.select()
    }
  }

  async aggregate(table: TableDo, viewId: Option<ViewId>): Promise<Record<string, AggregateResult>> {
    const t = new UnderlyingTable(table)
    const view = table.views.getViewById(viewId.into(undefined))
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
      .where(this.handleQuery(viewSpec))
      .executeTakeFirst()

    return result ?? {}
  }
}
