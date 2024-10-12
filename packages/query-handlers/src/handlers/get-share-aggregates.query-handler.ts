import { setContextValue } from "@undb/context/server"
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
  ) {}

  async execute(query: GetShareAggregatesQuery): Promise<any> {
    const { shareId } = query

    await this.spaceService.setSpaceContext(setContextValue, { shareId })

    return this.svc.getAggregates(query)
  }
}
