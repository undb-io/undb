import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetRollupForeignTablesQuery, type IGetRollupForeignTablesQuery } from "@undb/queries"
import { injectTableQueryService, type ITableDTO, type ITableQueryService } from "@undb/table"

@queryHandler(GetRollupForeignTablesQuery)
@singleton()
export class GetRollupForeignTablesTablesQueryHandler implements IQueryHandler<IGetRollupForeignTablesQuery, any> {
  constructor(
    @injectTableQueryService()
    private readonly svc: ITableQueryService,
  ) {}

  async execute(query: IGetRollupForeignTablesQuery): Promise<ITableDTO[]> {
    return this.svc.getRollupForeignTables(query.tableId, query.fieldId)
  }
}
