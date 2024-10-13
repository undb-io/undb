import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import type { Dashboard } from "../dashboard.do.js"
import type { IDashboardSpecVisitor } from "../interface.js"

export class WithDashboardSpaceId extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(public readonly spaceId: ISpaceId) {
    super()
  }
  isSatisfiedBy(t: Dashboard): boolean {
    return this.spaceId === t.spaceId
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    t.spaceId = this.spaceId
    return Ok(t)
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withDashboardSpaceId(this)
    return Ok(undefined)
  }
}
