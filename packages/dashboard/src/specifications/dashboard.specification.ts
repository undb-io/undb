import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do"
import type { IDashboardSpecVisitor } from "../interface"

export class DuplicatedDashboardSpecification extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(
    public readonly originalDashboard: Dashboard,
    public readonly duplicatedDashboard: Dashboard,
  ) {
    super()
  }
  isSatisfiedBy(t: Dashboard): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    return Ok(t)
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.duplicatedDashboard(this)
    return Ok(undefined)
  }
}
