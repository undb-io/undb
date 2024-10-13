import { container, inject } from "@undb/di"
import { DashboardQueryService } from "./dashboard.query-service"

export const DASHBOARD_QUERY_SERVICE = Symbol.for("DashboardQueryService")
export const injectDashboardQueryService = () => inject(DASHBOARD_QUERY_SERVICE)
container.register(DASHBOARD_QUERY_SERVICE, { useClass: DashboardQueryService })
