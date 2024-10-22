import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do.js"
import type { IDashboardSpecVisitor } from "../interface.js"

export class WithDashboardDescription extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(public readonly description?: string) {
    super()
  }
  static fromString(description?: string) {
    return new WithDashboardDescription(description)
  }
  isSatisfiedBy(t: Dashboard): boolean {
    return this.description === t.description
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    t.description = this.description
    return Ok(t)
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withDescription(this)
    return Ok(undefined)
  }
}
