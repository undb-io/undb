export * from "./dashboard-base-id.specification.js"
export * from "./dashboard-description.specification.js"
export * from "./dashboard-id.specification.js"
export * from "./dashboard-layout.specification.js"
export * from "./dashboard-name.specification.js"
export * from "./dashboard-q.specification.js"
export * from "./dashboard-space-id.specification.js"
export * from "./dashboard-table-id.specification.js"
export * from "./dashboard-unique.specification.js"
export * from "./dashboard-widget.specification.js"
export * from "./dashboard.specification.js"

import { CompositeSpecification, Err, Ok, Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do.js"
import type { IUniqueDashboardDTO } from "../dto/unique-dashboard.dto.js"
import type { IDashboardSpecVisitor } from "../interface.js"
import { DashboardId } from "../value-objects/dashboard-id.vo.js"
import { WithDashboardId } from "./dashboard-id.specification.js"
import { DashboardUniqueSpecification } from "./dashboard-unique.specification.js"

export type DashboardComositeSpecification = CompositeSpecification<Dashboard, IDashboardSpecVisitor>

export const withUniqueDashboard = (dto: IUniqueDashboardDTO): Result<DashboardComositeSpecification, string> => {
  if (dto.dashboardId) {
    return Ok(new WithDashboardId(new DashboardId(dto.dashboardId)))
  }
  if (dto.dashboardName && dto.baseName) {
    return Ok(new DashboardUniqueSpecification(dto.baseName, dto.dashboardName))
  }
  return Err("Invalid dashboard specification")
}
