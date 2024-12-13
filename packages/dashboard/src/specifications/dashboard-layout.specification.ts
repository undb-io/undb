import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Dashboard } from "../dashboard.do.js"
import type { IDashboardSpecVisitor } from "../interface.js"
import { DashboardLayouts, type IDashboardLayouts, type IDashboardWidget } from "../value-objects/index.js"

export class WithDashboardLayout extends CompositeSpecification<Dashboard, IDashboardSpecVisitor> {
  constructor(public readonly layout: IDashboardLayouts) {
    super()
  }
  static create(widgets: IDashboardWidget[], layouts?: IDashboardLayouts) {
    if (layouts) {
      return new WithDashboardLayout(layouts)
    }

    layouts = DashboardLayouts.getLayouts(widgets)
    return new WithDashboardLayout(layouts)
  }
  isSatisfiedBy(t: Dashboard): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Dashboard): Result<Dashboard, string> {
    t.layout = new DashboardLayouts(this.layout)
    return Ok(t)
  }
  accept(v: IDashboardSpecVisitor): Result<void, string> {
    v.withDashboardLayout(this)
    return Ok(undefined)
  }
}
