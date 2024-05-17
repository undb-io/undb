import { inject, singleton } from "@undb/di"
import { Option, andOptions } from "@undb/domain"
import type { IRecordQueryRepository, IRecordsDTO, Query, TableDo, ViewId } from "@undb/table"
import type { ExpressionBuilder } from "kysely"
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

  async find(
    table: TableDo,
    viewId: Option<ViewId>,
    query: Option<Query>,
  ): Promise<{ total: number; records: IRecordsDTO }> {
    const t = new UnderlyingTable(table)
    const schema = table.schema

    const viewSpec = table.views
      .getViewById(viewId.into(undefined))
      .filter.into(undefined)
      ?.getSpec(schema)
      .into(undefined)

    const filter = query.into(undefined)?.filter.into(undefined)

    const spec = andOptions(Option(viewSpec), Option(filter))
    const pagination = query.into(undefined)?.pagination.into(undefined)

    function handleQuery(eb: ExpressionBuilder<any, any>) {
      const visitor = new RecordFilterVisitor(eb)
      if (spec?.isSome()) {
        spec.unwrap().accept(visitor)
      }
      return visitor.cond
    }

    const result = await this.qb
      .selectFrom(t.name)
      // TODO: select spec
      .selectAll()
      .$if(!!pagination?.limit, (qb) => {
        const limit = pagination!.limit as number
        return qb.limit(limit).offset(((pagination?.page ?? 1) - 1) * limit)
      })
      .where((eb) => handleQuery(eb))
      .execute()

    const { total } = await this.qb
      .selectFrom(t.name)
      .select((eb) => eb.fn.countAll().as("total"))
      .executeTakeFirstOrThrow()

    const records = result.map((r) => this.mapper.toDTO(r))
    return { records, total: Number(total) }
  }
}
