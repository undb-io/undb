import { CompositeSpecification, Ok, type Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do"
import type { IDashboardSpecVisitor } from "../interface"

export class DashboardTableIdSpecification extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(public readonly tableId: string) {
    super()
  }
  isSatisfiedBy(t: Dashboard): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withDashboardTableId(this)
    return Ok(undefined)
  }
}
