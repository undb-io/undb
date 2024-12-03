import { injectContext, type IContext } from "@undb/context"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetShareAggregatesQuery } from "@undb/queries"
import { injectSpaceService, type ISpaceService } from "@undb/space"
import { injectRecordsQueryService, type IRecordsQueryService } from "@undb/table"

@queryHandler(GetShareAggregatesQuery)
@singleton()
export class GetShareAggregatesQueryHandler implements IQueryHandler<any, any> {
  constructor(
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(query: GetShareAggregatesQuery): Promise<any> {
    const { shareId } = query

    await this.spaceService.setSpaceContext(this.context, { shareId })

    return this.svc.getAggregates(query)
  }
}
