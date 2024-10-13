import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { Dashboard } from "./dashboard.do.js"
import type { WithDashboardId } from "./specifications/dashboard-id.specification.js"
import type { WithDashboardName } from "./specifications/dashboard-name.specification.js"
import type { WithDashboardQ } from "./specifications/dashboard-q.specification.js"
import type { WithDashboardSpaceId } from "./specifications/dashboard-space-id.specification.js"
import type { DuplicatedDashboardSpecification } from "./specifications/dashboard.specification.js"

export interface IDashboardSpecVisitor extends ISpecVisitor {
  withId(v: WithDashboardId): void
  withDashboardSpaceId(v: WithDashboardSpaceId): void
  duplicatedDashboard(v: DuplicatedDashboardSpecification): void
  withName(v: WithDashboardName): void
  withQ(v: WithDashboardQ): void
}

export type IDashboardSpecification = CompositeSpecification<Dashboard, IDashboardSpecVisitor>
