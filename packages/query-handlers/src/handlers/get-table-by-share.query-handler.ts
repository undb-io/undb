import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetTableByShareQuery, type IGetTableByShareQuery } from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import { type ITableDTO } from "@undb/table"

@queryHandler(GetTableByShareQuery)
@singleton()
export class GetTableByShareQueryHandler implements IQueryHandler<any, ITableDTO> {
  constructor(
    @injectShareService()
    private readonly svc: IShareService,
  ) {}

  async execute(query: IGetTableByShareQuery): Promise<ITableDTO> {
    return this.svc.getTableByShare(query.shareId)
  }
}
