import {
  WithDashboardId,
  type IDashboardDTO,
  type IDashboardQueryRepository,
  type IDashboardSpecification,
} from "@undb/dashboard"
import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { getCurrentTransaction } from "../ctx"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { DashboardFilterVisitor } from "./dashboard.filter-visitor"
import { DashboardMapper } from "./dashboard.mapper"
import { DashboardReferenceVisitor } from "./dashboard.reference-visitor"

@singleton()
export class DashboardQueryRepository implements IDashboardQueryRepository {
  constructor(
    @inject(DashboardMapper)
    private readonly mapper: DashboardMapper,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async find(spec: Option<IDashboardSpecification>): Promise<IDashboardDTO[]> {
    const qb = getCurrentTransaction() ?? this.qb
    const dashboards = await qb
      .selectFrom("undb_dashboard")
      .selectAll()
      .$if(spec.isSome(), (qb) => new DashboardReferenceVisitor(qb).call(spec.unwrap()))
      .where((eb) => {
        const visitor = new DashboardFilterVisitor(eb, qb)
        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }
        return visitor.cond
      })
      .execute()

    return dashboards.map((b) => this.mapper.toDTO(b))
  }

  async findOneById(id: string): Promise<Option<IDashboardDTO>> {
    const spec = WithDashboardId.fromString(id)

    const qb = getCurrentTransaction() ?? this.qb
    const dashboard = await this.qb
      .selectFrom("undb_dashboard")
      .selectAll()
      .$call((qb) => new DashboardReferenceVisitor(qb).call(spec))
      .where((eb) => {
        const visitor = new DashboardFilterVisitor(eb, qb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    return dashboard ? Some(this.mapper.toDTO(dashboard)) : None
  }
}
