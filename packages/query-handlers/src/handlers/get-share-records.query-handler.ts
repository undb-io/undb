import { setContextValue } from "@undb/context/server"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetShareRecordsQuery, type IGetShareRecordsOutput, type IGetShareRecordsQuery } from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import { injectSpaceService, type ISpaceService } from "@undb/space"

@queryHandler(GetShareRecordsQuery)
@singleton()
export class GetShareRecordsQueryHandler implements IQueryHandler<IGetShareRecordsQuery, IGetShareRecordsOutput> {
  constructor(
    @injectShareService()
    private readonly svc: IShareService,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
  ) {}

  async execute(query: IGetShareRecordsQuery): Promise<IGetShareRecordsOutput> {
    const { shareId } = query
    await this.spaceService.setSpaceContext(setContextValue, { shareId })
    const records = await this.svc.getShareRecords(shareId, query.tableId, query.viewId)

    return {
      total: records.total,
      records: records.values,
    }
  }
}
