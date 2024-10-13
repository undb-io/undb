import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do.js"
import type { IDashboardSpecVisitor } from "../interface.js"
import { DashboardId } from "../value-objects/dashboard-id.vo.js"

export class WithDashboardId extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(public readonly id: DashboardId) {
    super()
  }
  static fromString(id: string) {
    return new WithDashboardId(DashboardId.from(id))
  }
  isSatisfiedBy(t: Dashboard): boolean {
    return this.id.equals(t.id)
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
