import {
  WithDashboardId,
  type IDashboardDTO,
  type IDashboardQueryRepository,
  type IDashboardSpecification,
} from "@undb/dashboard"
import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"
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
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}

  async find(spec: Option<IDashboardSpecification>): Promise<IDashboardDTO[]> {
    const qb = this.txContext.getCurrentTransaction()
    const dashboards = await qb
      .selectFrom("undb_dashboard")
      .selectAll()
      .$if(spec.isSome(), (sb) => new DashboardReferenceVisitor(sb).call(spec.unwrap()))
      .$if(spec.isSome(), (sb) => sb.where((eb) => new DashboardFilterVisitor(eb, qb).$where(spec.unwrap())))
      .execute()

    return dashboards.map((b) => this.mapper.toDTO(b))
  }

  async findOneById(id: string): Promise<Option<IDashboardDTO>> {
    const spec = WithDashboardId.fromString(id)

    const qb = this.txContext.getCurrentTransaction()
    const dashboard = await this.qb
      .selectFrom("undb_dashboard")
      .selectAll()
      .$call((qb) => new DashboardReferenceVisitor(qb).call(spec))
      .where((eb) => new DashboardFilterVisitor(eb, qb).$where(spec))
      .executeTakeFirst()

    return dashboard ? Some(this.mapper.toDTO(dashboard)) : None
  }
}
