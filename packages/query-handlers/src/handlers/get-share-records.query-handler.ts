import { injectContext, type IContext } from "@undb/context"
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
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(query: IGetShareRecordsQuery): Promise<IGetShareRecordsOutput> {
    const { shareId } = query
    await this.spaceService.setSpaceContext(this.context, { shareId })
    const records = await this.svc.getShareRecords(
      shareId,
      query.tableId,
      query.viewId,
      query.q ?? undefined,
      query.filters ?? undefined,
      query.select ?? undefined,
      query.pagination ?? undefined,
    )

    return {
      total: records.total,
      records: records.values,
    }
  }
}
