import { inject } from "@undb/di"
import { Option } from "@undb/domain"
import type { Dashboard } from "./dashboard.do.js"
import type { IDashboardDTO } from "./dto/dashboard.dto.js"
import type { IDashboardSpecification } from "./interface.js"

export interface IDashboardRepository {
  find(spec: IDashboardSpecification): Promise<Dashboard[]>
  findOne(spec: IDashboardSpecification): Promise<Option<Dashboard>>
  findOneById(id: string): Promise<Option<Dashboard>>

  insert(dashboard: Dashboard): Promise<void>
  insertMany(dashboards: Dashboard[]): Promise<void>
  updateOneById(dashboard: Dashboard, spec: IDashboardSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}

export const DASHBOARD_REPOSITORY = Symbol.for("IDashboardRepository")
export const injectDashboardRepository = () => inject(DASHBOARD_REPOSITORY)

export interface IDashboardQueryRepository {
  find(spec: Option<IDashboardSpecification>): Promise<IDashboardDTO[]>
  findOneById(id: string): Promise<Option<IDashboardDTO>>
}

export const DASHBOARD_QUERY_REPOSITORY = Symbol.for("IDashboardQueryRepository")
export const injectDashboardQueryRepository = () => inject(DASHBOARD_QUERY_REPOSITORY)
