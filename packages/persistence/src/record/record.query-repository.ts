import { inject, singleton } from "@undb/di"
import { None, Option, Some, andOptions, type PaginatedDTO } from "@undb/domain"
import {
  ID_TYPE,
  type IRecordDTO,
  type IRecordQueryRepository,
  type Query,
  type RecordId,
  type TableDo,
  type TableId,
  type ViewId,
} from "@undb/table"
import type { ExpressionBuilder, SelectQueryBuilder } from "kysely"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTable } from "../underlying/underlying-table"
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

  async find(table: TableDo, viewId: Option<ViewId>, query: Option<Query>): Promise<PaginatedDTO<IRecordDTO>> {
    const t = new UnderlyingTable(table)
    const view = table.views.getViewById(viewId.into(undefined))
    const schema = table.schema

    const viewSpec = view.filter.into(undefined)?.getSpec(schema).into(undefined)

    const filter = query.into(undefined)?.filter.into(undefined)
    const sort = view.sort.into(undefined)?.value

    const spec = andOptions(Option(viewSpec), Option(filter))
    const pagination = query.into(undefined)?.pagination.into(undefined)

    function handleQuery(eb: ExpressionBuilder<any, any>) {
      const visitor = new RecordFilterVisitor(eb)
      if (spec?.isSome()) {
        spec.unwrap().accept(visitor)
      }
      return visitor.cond
    }

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
      .where(handleQuery)
      .execute()

    const { total } = await this.qb
      .selectFrom(t.name)
      .select((eb) => eb.fn.countAll().as("total"))
      .executeTakeFirstOrThrow()

    const records = result.map((r) => this.mapper.toDTO(r))
    return { values: records, total: Number(total) }
  }
}
