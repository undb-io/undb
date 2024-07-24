import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetTableForeignTablesQuery, type IGetTableForeignTablesQuery } from "@undb/queries"
import { injectTableQueryService, type ITableDTO, type ITableQueryService } from "@undb/table"

@queryHandler(GetTableForeignTablesQuery)
@singleton()
export class GetTableForeignTablesQueryHandler implements IQueryHandler<IGetTableForeignTablesQuery, ITableDTO[]> {
  constructor(
    @injectTableQueryService()
    private readonly svc: ITableQueryService,
  ) {}

  async execute(query: IGetTableForeignTablesQuery): Promise<ITableDTO[]> {
    return this.svc.getTableForeignTables(query.tableId)
  }
}
