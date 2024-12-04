import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetTableQuery, type IGetTableOutput, type IGetTableQuery } from "@undb/queries"
import { injectTableQueryService, type ITableQueryService } from "@undb/table"

@queryHandler(GetTableQuery)
@singleton()
export class GetTableQueryHandler implements IQueryHandler<IGetTableQuery, IGetTableOutput> {
  constructor(
    @injectTableQueryService()
    private readonly svc: ITableQueryService,
  ) {}

  async execute(query: IGetTableQuery): Promise<IGetTableOutput> {
    return this.svc.getTable(query.tableId)
  }
}
