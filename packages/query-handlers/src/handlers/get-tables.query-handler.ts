import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetTablesQuery } from "@undb/queries"
import { injectTableQueryService, type ITableDTO, type ITableQueryService } from "@undb/table"

@queryHandler(GetTablesQuery)
@singleton()
export class GetTablesQueryHandler implements IQueryHandler<GetTablesQuery, ITableDTO[]> {
  constructor(
    @injectTableQueryService()
    private readonly svc: ITableQueryService,
  ) {}

  async execute(query: GetTablesQuery): Promise<ITableDTO[]> {
    return this.svc.getTables(query.baseId)
  }
}
