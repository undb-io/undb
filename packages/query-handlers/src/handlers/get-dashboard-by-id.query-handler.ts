import { queryHandler } from "@undb/cqrs"
import { injectDashboardQueryService, type IDashboardDTO, type IDashboardQueryService } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetDashboardByIdQuery } from "@undb/queries"

@queryHandler(GetDashboardByIdQuery)
@singleton()
export class GetDashboardByIdQueryHandler implements IQueryHandler<GetDashboardByIdQuery, IDashboardDTO> {
  constructor(
    @injectDashboardQueryService()
    private readonly svc: IDashboardQueryService,
  ) {}

  async execute(query: GetDashboardByIdQuery): Promise<IDashboardDTO> {
    return (await this.svc.getDashboardById(query.id)).expect("dashboard not found")
  }
}
