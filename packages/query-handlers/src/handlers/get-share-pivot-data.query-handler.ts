import { injectContext, type IContext } from "@undb/context"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetSharePivotDataQuery, type IGetSharePivotDataOutput, type IGetSharePivotDataQuery } from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import { injectSpaceService, type ISpaceService } from "@undb/space"

@queryHandler(GetSharePivotDataQuery)
@singleton()
export class GetSharePivotDataQueryHandler implements IQueryHandler<IGetSharePivotDataQuery, IGetSharePivotDataOutput> {
  constructor(
    @injectShareService()
    private readonly svc: IShareService,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(query: IGetSharePivotDataQuery): Promise<IGetSharePivotDataOutput> {
    const { shareId } = query
    await this.spaceService.setSpaceContext(this.context, { shareId })
    const data = await this.svc.getSharePivotData(shareId, query)

    return data
  }
}
