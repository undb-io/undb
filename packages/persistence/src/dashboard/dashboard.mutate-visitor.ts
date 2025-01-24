import type {
  Dashboard,
  DashboardBaseIdSpecification,
  DashboardTableIdSpecification,
  DashboardUniqueSpecification,
  DuplicatedDashboardSpecification,
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
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"
import type { IDbProvider } from "../db.provider"
import type { IQueryBuilder } from "../qb.type"
import { json } from "../qb.util"

export class DashboardMutateVisitor extends AbstractQBMutationVisitor implements IDashboardSpecVisitor {
  constructor(
    private readonly dashboard: Dashboard,
    private readonly qb: IQueryBuilder,
    private readonly dbProvider: IDbProvider,
  ) {
    super()
  }

  $mutate(spec: IDashboardSpecification) {
    spec.accept(this)
    return this
  }

  withUniqueDashboard(v: DashboardUniqueSpecification): void {}
  withDescription(v: WithDashboardDescription): void {
    this.setData("description", v.description ?? null)
  }
  withDashboardTableId(v: DashboardTableIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withDashboardLayout(v: WithDashboardLayout): void {
    this.setData("layout", v.layout ? json(v.layout) : null)
  }
  withDashboardWidgets(v: WithDashboardWidgets): void {
    this.setData("widgets", v.widgets.value.length ? json(v.widgets.value) : null)
    const dashboardId = this.dashboard.id.value

    const deleteSql = this.qb
      .deleteFrom("undb_dashboard_table_id_mapping")
      .where("dashboard_id", "=", dashboardId)
      .compile()
    this.addSql(deleteSql)

    const tableIds = v.widgets.tableIds
    if (tableIds.length > 0) {
      for (const tableId of tableIds) {
        const sql = this.qb
          .insertInto("undb_dashboard_table_id_mapping")
          .values({ dashboard_id: dashboardId, table_id: tableId })
          .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
          .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((ob) => ob.doNothing()))
          .compile()
        this.addSql(sql)
      }
    }
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
