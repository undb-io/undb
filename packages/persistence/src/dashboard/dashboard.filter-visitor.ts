import type {
  Dashboard,
  DashboardBaseIdSpecification,
  DashboardTableIdSpecification,
  DashboardUniqueSpecification,
  IDashboardSpecification,
  IDashboardSpecVisitor,
  WithDashboardDescription,
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
import type { IQueryBuilder } from "../qb.type"

export class DashboardFilterVisitor extends AbstractQBVisitor<Dashboard> implements IDashboardSpecVisitor {
  constructor(
    protected readonly eb: ExpressionBuilder<Database, "undb_dashboard">,
    private readonly qb: IQueryBuilder,
  ) {
    super(eb)
  }

  $where(spec: IDashboardSpecification) {
    spec.accept(this)
    return this.cond
  }

  withDescription(v: WithDashboardDescription): void {
    this.addCond(this.eb.eb("description", "=", v.description ?? null))
  }
  withUniqueDashboard(v: DashboardUniqueSpecification): void {}
  withDashboardTableId(v: DashboardTableIdSpecification): void {
    const subQuery = this.qb
      .selectFrom("undb_dashboard_table_id_mapping")
      .select("dashboard_id")
      .where("table_id", "=", v.tableId)
    const cond = this.eb.eb("id", "in", subQuery)
    this.addCond(cond)
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
    return new DashboardFilterVisitor(this.eb, this.qb) as this
  }
}
