import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import { injectTableRepository, TableIdVo, type ITableRepository } from "@undb/table"
import type { Dashboard } from "../dashboard.do"
import { injectDashboardRepository, type IDashboardRepository } from "../dashboard.repository"
import type { IAddDashboardWidgetDTO } from "../dto"

export interface IDashboarService {
  addWidget(dto: IAddDashboardWidgetDTO): Promise<Dashboard>
}

@singleton()
export class DashboardService implements IDashboarService {
  private readonly logger = createLogger(DashboardService.name)

  constructor(
    @injectDashboardRepository()
    private readonly dashboardRepository: IDashboardRepository,
    @injectTableRepository()
    private readonly tableRepository: ITableRepository,
  ) {}

  async addWidget(dto: IAddDashboardWidgetDTO): Promise<Dashboard> {
    const dashboard = (await this.dashboardRepository.findOneById(dto.dashboardId)).expect("dashboard not found")
    const tableId = dto.widget.table.id
    if (!tableId) {
      throw new Error("table id is required")
    }

    ;(await this.tableRepository.findOneById(new TableIdVo(tableId))).expect("table not found")

    const spec = dashboard.$addWidget(dto)
    if (spec.isNone()) {
      return dashboard
    }
    spec.unwrap().mutate(dashboard)

    await this.dashboardRepository.updateOneById(dashboard, spec.unwrap())

    return dashboard
  }
}