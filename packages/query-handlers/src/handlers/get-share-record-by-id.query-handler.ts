import { injectContext, type IContext } from "@undb/context"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetShareRecordByIdQuery, type IGetShareRecordByIdOutput, type IGetShareRecordByIdQuery } from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import { injectSpaceService, type ISpaceService } from "@undb/space"

@queryHandler(GetShareRecordByIdQuery)
@singleton()
export class GetShareRecordByIdQueryHandler
  implements IQueryHandler<IGetShareRecordByIdQuery, IGetShareRecordByIdOutput>
{
  constructor(
    @injectShareService()
    private readonly svc: IShareService,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(query: IGetShareRecordByIdQuery): Promise<IGetShareRecordByIdOutput> {
    const { shareId, recordId } = query
    await this.spaceService.setSpaceContext(this.context, { shareId })
    const record = await this.svc.getShareRecordById(shareId, recordId, query.tableId, query.viewId)

    return {
      record: record.into(null),
    }
  }
}
