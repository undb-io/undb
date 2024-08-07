import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetTableQuery, type IGetTableQuery } from "@undb/queries"
import { injectTableQueryService, type ITableDTO, type ITableQueryService } from "@undb/table"

@queryHandler(GetTableQuery)
@singleton()
export class GetTableQueryHandler implements IQueryHandler<any, ITableDTO> {
  constructor(
    @injectTableQueryService()
    private readonly svc: ITableQueryService,
  ) {}

  async execute(query: IGetTableQuery): Promise<ITableDTO> {
    return this.svc.getTable(query.tableId)
  }
}
