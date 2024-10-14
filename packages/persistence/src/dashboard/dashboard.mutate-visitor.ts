import type {
  DashboardBaseIdSpecification,
  DuplicatedDashboardSpecification,
  IDashboardSpecVisitor,
  WithDashboardId,
  WithDashboardName,
  WithDashboardQ,
  WithDashboardSpaceId,
  WithDashboardWidgets,
} from "@undb/dashboard"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"
import { json } from "../qb"

export class DashboardMutateVisitor extends AbstractQBMutationVisitor implements IDashboardSpecVisitor {
  withDashboardWidgets(v: WithDashboardWidgets): void {
    this.setData("widgets", v.widgets.length ? json(v.widgets) : null)
  }
  withDashboardBaseId(v: DashboardBaseIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  duplicatedDashboard(v: DuplicatedDashboardSpecification): void {
    throw new Error("Method not implemented.")
  }
  withId(v: WithDashboardId): void {
    throw new Error("Method not implemented.")
  }
  withDashboardSpaceId(v: WithDashboardSpaceId): void {
    throw new Error("Method not implemented.")
  }
  withName(v: WithDashboardName): void {
    this.setData("name", v.name.value)
  }
  withQ(v: WithDashboardQ): void {
    throw new Error("Method not implemented.")
  }
}
