import type {
  DashboardBaseIdSpecification,
  DashboardComositeSpecification,
  DashboardTableIdSpecification,
  DashboardUniqueSpecification,
  DuplicatedDashboardSpecification,
  IDashboardSpecVisitor,
  WithDashboardDescription,
  WithDashboardId,
  WithDashboardLayout,
  WithDashboardName,
  WithDashboardQ,
  WithDashboardSpaceId,
  WithDashboardWidgets,
} from "@undb/dashboard"
import type { ISpecification } from "@undb/domain"
import type { SelectQueryBuilder } from "kysely"
import type { Dashboard, Database } from "../db"

export class DashboardReferenceVisitor implements IDashboardSpecVisitor {
  constructor(private sqb: SelectQueryBuilder<Database, "undb_dashboard", Dashboard>) {}

  call(spec: DashboardComositeSpecification) {
    spec.accept(this)
    return this.sqb
  }
  withId(v: WithDashboardId): void {}
  withDescription(v: WithDashboardDescription): void {}
  withDashboardSpaceId(v: WithDashboardSpaceId): void {}
  withDashboardBaseId(v: DashboardBaseIdSpecification): void {}
  withDashboardTableId(v: DashboardTableIdSpecification): void {}
  duplicatedDashboard(v: DuplicatedDashboardSpecification): void {}
  withDashboardWidgets(v: WithDashboardWidgets): void {}
  withDashboardLayout(v: WithDashboardLayout): void {}
  withName(v: WithDashboardName): void {}
  withQ(v: WithDashboardQ): void {}
  withUniqueDashboard(v: DashboardUniqueSpecification): void {
    this.sqb = this.sqb
      .innerJoin("undb_base", "undb_dashboard.base_id", "undb_base.id")
      .where((eb) =>
        eb.and([eb.eb("undb_base.name", "=", v.baseName), eb.eb("undb_dashboard.name", "=", v.dashboardName)]),
      )
  }
  and(left: ISpecification, right: ISpecification): this {
    left.accept(this)
    right.accept(this)
    return this
  }
  or(left: ISpecification, right: ISpecification): this {
    left.accept(this)
    right.accept(this)
    return this
  }
  not(spec: ISpecification): this {
    spec.accept(this)
    return this
  }
  clone(): this {
    return this
  }
}
