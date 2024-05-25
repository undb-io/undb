import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetAggregatesQuery, type IGetAggregatesOutput, type IGetAggregatesQuery } from "@undb/queries"
import { injectRecordsQueryService, type IRecordsQueryService } from "@undb/table"

@queryHandler(GetAggregatesQuery)
@singleton()
export class GetAggregatesQueryHandler implements IQueryHandler<IGetAggregatesQuery, IGetAggregatesOutput> {
  constructor(
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService,
  ) {}

  async execute(query: IGetAggregatesQuery): Promise<IGetAggregatesOutput> {
    return this.svc.getAggregates(query)
  }
}
