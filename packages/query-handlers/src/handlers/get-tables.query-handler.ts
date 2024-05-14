import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { GetTablesQuery } from "@undb/queries"
import { injectTableQueryService, type ITableDTO, type ITableQueryService } from "@undb/table"

@queryHandler(GetTablesQuery)
@singleton()
export class GetTablesQueryHandler implements IQueryHandler<any, any> {
  private readonly logger = createLogger(GetTablesQueryHandler.name)

  constructor(
    @injectTableQueryService()
    private readonly svc: ITableQueryService,
  ) {}

  async execute(query: any): Promise<ITableDTO[]> {
    this.logger.debug(query, "get tables query executed")

    return this.svc.getTables()
  }
}
