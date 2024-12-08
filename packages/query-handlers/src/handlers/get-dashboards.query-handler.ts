import { queryHandler } from "@undb/cqrs"
import { injectDashboardQueryService, type IDashboardQueryService } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetDashboardsQuery, type IGetDashboardsOutput } from "@undb/queries"

@queryHandler(GetDashboardsQuery)
@singleton()
export class GetDashboardsQueryHandler implements IQueryHandler<GetDashboardsQuery, IGetDashboardsOutput> {
  constructor(
    @injectDashboardQueryService()
    private readonly svc: IDashboardQueryService,
  ) {}

  async execute(query: GetDashboardsQuery): Promise<IGetDashboardsOutput> {
    return this.svc.getDashboards(query.baseId)
  }
}
