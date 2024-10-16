import type {
  Dashboard,
  DashboardBaseIdSpecification,
  IDashboardSpecVisitor,
  WithDashboardId,
  WithDashboardLayout,
  WithDashboardName,
  WithDashboardQ,
  WithDashboardSpaceId,
  WithDashboardWidgets,
} from "@undb/dashboard"
import type { DuplicatedDashboardSpecification } from "@undb/dashboard/src/specifications/dashboard.specification"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class DashboardFilterVisitor extends AbstractQBVisitor<Dashboard> implements IDashboardSpecVisitor {
  constructor(protected readonly eb: ExpressionBuilder<Database, "undb_dashboard">) {
    super(eb)
  }

  withDashboardLayout(v: WithDashboardLayout): void {
    throw new Error("Method not implemented.")
  }
  withDashboardWidgets(v: WithDashboardWidgets): void {
    throw new Error("Method not implemented.")
  }
  withDashboardBaseId(v: DashboardBaseIdSpecification): void {
    this.addCond(this.eb.eb("base_id", "=", v.baseId))
  }
  duplicatedDashboard(v: DuplicatedDashboardSpecification): void {
    throw new Error("Not implemented")
  }
  withId(v: WithDashboardId): void {
    this.addCond(this.eb.eb("id", "=", v.id.value))
  }
  withDashboardSpaceId(v: WithDashboardSpaceId): void {
    this.addCond(this.eb.eb("space_id", "=", v.spaceId))
  }
  withName(v: WithDashboardName): void {
    this.addCond(this.eb.eb("name", "=", v.name.value))
  }
  withQ(v: WithDashboardQ): void {
    this.addCond(this.eb.eb("name", "like", `%${v.q}%`))
  }
  clone(): this {
    return new DashboardFilterVisitor(this.eb) as this
  }
}
