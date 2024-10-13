import { queryHandler } from "@undb/cqrs"
import { injectDashboardQueryService, type IDashboardDTO, type IDashboardQueryService } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetDashboardsQuery } from "@undb/queries"

@queryHandler(GetDashboardsQuery)
@singleton()
export class GetDashboardsQueryHandler implements IQueryHandler<GetDashboardsQuery, IDashboardDTO[]> {
  constructor(
    @injectDashboardQueryService()
    private readonly svc: IDashboardQueryService,
  ) {}

  async execute(query: GetDashboardsQuery): Promise<IDashboardDTO[]> {
    return this.svc.getDashboards(query.baseId)
  }
}
