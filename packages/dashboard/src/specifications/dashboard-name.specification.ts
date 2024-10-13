import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do.js"
import type { IDashboardSpecVisitor } from "../interface.js"
import { DashboardName } from "../value-objects/dashboard-name.vo.js"

export class WithDashboardName extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(public readonly name: DashboardName) {
    super()
  }
  static fromString(name: string) {
    return new WithDashboardName(new DashboardName({ value: name }))
  }
  isSatisfiedBy(t: Dashboard): boolean {
    return this.name.equals(t.name)
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    t.name = this.name
    return Ok(t)
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withName(this)
    return Ok(undefined)
  }
}
