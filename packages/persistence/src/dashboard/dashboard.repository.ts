import { injectContext, type IContext } from "@undb/context"
import {
  injectDashboardOutboxService,
  WithDashboardId,
  WithDashboardSpaceId,
  type Dashboard,
  type IDashboardOutboxService,
  type IDashboardRepository,
  type IDashboardSpecification,
} from "@undb/dashboard"
import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { getCurrentTransaction } from "../ctx"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { DashboardFilterVisitor } from "./dashboard.filter-visitor"
import { DashboardMapper } from "./dashboard.mapper"
import { DashboardMutateVisitor } from "./dashboard.mutate-visitor"

@singleton()
export class DashboardRepository implements IDashboardRepository {
  constructor(
    @inject(DashboardMapper)
    private readonly mapper: DashboardMapper,
    @injectDashboardOutboxService()
    private readonly outboxService: IDashboardOutboxService,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async find(spec: IDashboardSpecification): Promise<Dashboard[]> {
    const tx = getCurrentTransaction() ?? this.qb
    const dashboards = await tx
      .selectFrom("undb_dashboard")
      .selectAll()
      .where((eb) => {
        const visitor = new DashboardFilterVisitor(eb, tx)
        spec.accept(visitor)
        return visitor.cond
      })
      .execute()

    return dashboards.map((dashboard) => this.mapper.toDo(dashboard))
  }
  async findOne(spec: IDashboardSpecification): Promise<Option<Dashboard>> {
    const tx = getCurrentTransaction() ?? this.qb
    const dashboard = await tx
      .selectFrom("undb_dashboard")
      .selectAll()
      .where((eb) => {
        const visitor = new DashboardFilterVisitor(eb, tx)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    return dashboard ? Some(this.mapper.toDo(dashboard)) : None
  }
  async findOneById(id: string): Promise<Option<Dashboard>> {
    const spaceId = this.context.mustGetCurrentSpaceId()
    const spec = WithDashboardId.fromString(id).and(new WithDashboardSpaceId(spaceId))

    const tx = getCurrentTransaction() ?? this.qb
    const dashboard = await tx
      .selectFrom("undb_dashboard")
      .selectAll()
      .where((eb) => {
        const visitor = new DashboardFilterVisitor(eb, tx)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    return dashboard ? Some(this.mapper.toDo(dashboard)) : None
  }
  async insert(dashboard: Dashboard): Promise<void> {
    const user = this.context.mustGetCurrentUserId()
    const values = this.mapper.toEntity(dashboard)

    const qb = getCurrentTransaction() ?? this.qb
    await qb
      .insertInto("undb_dashboard")
      .values({
        ...values,
        created_by: user,
        updated_by: user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .execute()
    const tableIds = dashboard.tableIds
    if (tableIds.length > 0) {
      await qb
        .insertInto("undb_dashboard_table_id_mapping")
        .values(tableIds.map((id) => ({ dashboard_id: dashboard.id.value, table_id: id })))
        .execute()
    }
    await this.outboxService.save(dashboard)
  }

  async insertMany(dashboards: Dashboard[]): Promise<void> {
    for (const dashboard of dashboards) {
      await this.insert(dashboard)
    }
  }

  async updateOneById(dashboard: Dashboard, spec: IDashboardSpecification): Promise<void> {
    const userId = this.context.mustGetCurrentUserId()

    const qb = getCurrentTransaction() ?? this.qb
    const visitor = new DashboardMutateVisitor(dashboard, qb)
    spec.accept(visitor)

    await qb
      .updateTable("undb_dashboard")
      .set({ ...visitor.data, updated_by: userId, updated_at: new Date().toISOString() })
      .where((eb) => eb.eb("id", "=", dashboard.id.value))
      .execute()

    for (const sql of visitor.sql) {
      await qb.executeQuery(sql)
    }
    await this.outboxService.save(dashboard)
  }

  async deleteOneById(id: string): Promise<void> {
    const qb = getCurrentTransaction() ?? this.qb

    await qb
      .deleteFrom("undb_dashboard_table_id_mapping")
      .where((eb) => eb.eb("dashboard_id", "=", id))
      .execute()

    await qb
      .deleteFrom("undb_dashboard")
      .where((eb) => eb.eb("id", "=", id))
      .execute()
  }
}
