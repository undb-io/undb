import { inject, singleton } from "@undb/di"
import { None, Option, Some, andOptions, type PaginatedDTO } from "@undb/domain"
import {
  ID_TYPE,
  RecordComositeSpecification,
  type AggregateResult,
  type IRecordDTO,
  type IRecordQueryRepository,
  type Query,
  type RecordId,
  type TableDo,
  type TableId,
  type ViewId,
} from "@undb/table"
import type { AliasedExpression, ExpressionBuilder, SelectQueryBuilder } from "kysely"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTable } from "../underlying/underlying-table"
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
    const result = await this.qb.selectFrom(t.name).selectAll().where(ID_TYPE, "=", id.value).executeTakeFirst()

    return result ? Some(this.mapper.toDTO(result)) : None
  }

  private handleQuery(eb: ExpressionBuilder<any, any>, spec: Option<RecordComositeSpecification>) {
    const visitor = new RecordFilterVisitor(eb)
    if (spec?.isSome()) {
      spec.unwrap().accept(visitor)
    }
    return visitor.cond
  }

  async find(table: TableDo, viewId: Option<ViewId>, query: Option<Query>): Promise<PaginatedDTO<IRecordDTO>> {
    const t = new UnderlyingTable(table)
    const view = table.views.getViewById(viewId.into(undefined))
    const schema = table.schema

    const viewSpec = view.filter.into(undefined)?.getSpec(schema).into(undefined)

    const filter = query.into(undefined)?.filter.into(undefined)
    const sort = view.sort.into(undefined)?.value

    const spec = andOptions(Option(viewSpec), Option(filter)) as Option<RecordComositeSpecification>
    const pagination = query.into(undefined)?.pagination.into(undefined)

    const handlePagination = (qb: SelectQueryBuilder<any, any, any>) => {
      const limit = pagination!.limit as number
      return qb.limit(limit).offset(((pagination?.page ?? 1) - 1) * limit)
    }

    const handleSort = (qb: SelectQueryBuilder<any, any, any>) => {
      return sort!.reduce((qb, s) => qb.orderBy(`${s.fieldId} ${s.direction}`), qb)
    }

    const result = await this.qb
      .selectFrom(t.name)
      // TODO: select spec
      .selectAll()
      .$if(!!pagination?.limit, handlePagination)
      .$if(!!sort, handleSort)
      .where((eb) => this.handleQuery(eb, spec))
      .execute()

    // TODO: move total to aggregate result
    const { total } = await this.qb
      .selectFrom(t.name)
      .select((eb) => eb.fn.countAll().as("total"))
      .where((eb) => this.handleQuery(eb, spec))
      .executeTakeFirstOrThrow()

    const records = result.map((r) => this.mapper.toDTO(r))
    return { values: records, total: Number(total) }
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
      .where((eb) => this.handleQuery(eb, viewSpec))
      .executeTakeFirst()

    return result ?? {}
  }
}
