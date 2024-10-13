import { singleton } from "@undb/di"
import type { Option } from "@undb/domain"
import { injectDashboardQueryRepository, type IDashboardQueryRepository } from "../dashboard.repository"
import type { IDashboardDTO } from "../dto"
import { getDashboardByIdMethod } from "./methods/get-dashboard-by-id.method"
import { getDashboardsMethod } from "./methods/get-dashboards.method"

export interface IDashboardQueryService {
  getDashboards(baseId?: string): Promise<IDashboardDTO[]>
  getDashboardById(id: string): Promise<Option<IDashboardDTO>>
}

@singleton()
export class DashboardQueryService implements IDashboardQueryService {
  constructor(@injectDashboardQueryRepository() readonly repo: IDashboardQueryRepository) {}

  getDashboards = getDashboardsMethod
  getDashboardById = getDashboardByIdMethod
}
