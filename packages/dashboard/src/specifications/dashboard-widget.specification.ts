import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do.js"
import type { IDashboardSpecVisitor } from "../interface.js"
import { DashboardWidgets, type IDashboardWidgets } from "../value-objects/index.js"

export class WithDashboardWidgets extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(public readonly widgets: DashboardWidgets) {
    super()
  }

  static from(dtos: IDashboardWidgets): WithDashboardWidgets {
    return new WithDashboardWidgets(new DashboardWidgets(dtos))
  }
  isSatisfiedBy(t: Dashboard): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    t.widgets = this.widgets
    return Ok(t)
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withDashboardWidgets(this)
    return Ok(undefined)
  }
}
