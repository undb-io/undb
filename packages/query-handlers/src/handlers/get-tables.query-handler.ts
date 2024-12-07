import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetTablesQuery, type IGetTablesOutput } from "@undb/queries"
import { injectTableQueryService, type ITableQueryService } from "@undb/table"

@queryHandler(GetTablesQuery)
@singleton()
export class GetTablesQueryHandler implements IQueryHandler<GetTablesQuery, IGetTablesOutput> {
  constructor(
    @injectTableQueryService()
    private readonly svc: ITableQueryService,
  ) {}

  async execute(query: GetTablesQuery): Promise<IGetTablesOutput> {
    return this.svc.getTables(query.baseId)
  }
}
