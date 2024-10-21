import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do"
import type { IDashboardSpecVisitor } from "../interface"

export class DashboardUniqueSpecification extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(
    public readonly baseName: string,
    public readonly dashboardName: string,
  ) {
    super()
  }

  isSatisfiedBy(t: Dashboard): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withUniqueDashboard(this)
    return Ok(undefined)
  }
}
