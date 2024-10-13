import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do.js"
import type { IDashboardSpecVisitor } from "../interface.js"

export class WithDashboardQ extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(public readonly q: string) {
    super()
  }
  isSatisfiedBy(t: Dashboard): boolean {
    return t.name.unpack().includes(this.q)
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    return Ok(t)
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withQ(this)
    return Ok(undefined)
  }
}
