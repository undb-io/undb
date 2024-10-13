import { CompositeSpecification, Ok, type Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do"
import type { IDashboardSpecVisitor } from "../interface"

export class DashboardBaseIdSpecification extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(public readonly baseId: string) {
    super()
  }
  isSatisfiedBy(t: Dashboard): boolean {
    return t.baseId === this.baseId
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    t.baseId = this.baseId
    return Ok(t)
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withDashboardBaseId(this)
    return Ok(undefined)
  }
}
