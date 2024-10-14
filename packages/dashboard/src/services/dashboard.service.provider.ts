import { container, inject } from "@undb/di"
import { DashboardService } from "./dashboard.service"

export const DASHBOARD_SERVICE = Symbol.for("DashboardService")
export const injectDashboardService = () => inject(DASHBOARD_SERVICE)
container.register(DASHBOARD_SERVICE, { useClass: DashboardService })
