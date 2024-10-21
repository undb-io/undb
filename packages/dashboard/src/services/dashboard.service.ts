import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import { injectTableRepository, TableIdVo, type ITableRepository } from "@undb/table"
import type { Dashboard } from "../dashboard.do"
import { injectDashboardRepository, type IDashboardRepository } from "../dashboard.repository"
import type { IAddDashboardWidgetDTO } from "../dto/add-dashboard-widget.dto"
import type { IDuplicateDashboardWidgetDTO } from "../dto/duplicate-dashboard-widget.dto"
import type { IRelayoutDashboardWidgetsDTO } from "../dto/relayout-dashboard-widgets.dto"

export interface IDashboarService {
  addWidget(dto: IAddDashboardWidgetDTO): Promise<Dashboard>
  duplicateWidget(dto: IDuplicateDashboardWidgetDTO): Promise<Dashboard>
  relayoutWidgets(dto: IRelayoutDashboardWidgetsDTO): Promise<Dashboard>
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
    this.logger.debug(dto)

    const dashboard = (await this.dashboardRepository.findOneById(dto.dashboardId)).expect("dashboard not found")
    const tableId = dto.widget.table.id
    if (!tableId) {
      throw new Error("table id is required")
    }

    const table = (await this.tableRepository.findOneById(new TableIdVo(tableId))).expect("table not found")

    const spec = dashboard.$addWidget(table, dto)
    if (spec.isNone()) {
      return dashboard
    }
    spec.unwrap().mutate(dashboard)

    await this.dashboardRepository.updateOneById(dashboard, spec.unwrap())

    return dashboard
  }

  async duplicateWidget(dto: IDuplicateDashboardWidgetDTO): Promise<Dashboard> {
    this.logger.debug(dto)

    const dashboard = (await this.dashboardRepository.findOneById(dto.dashboardId)).expect("dashboard not found")
    const widget = dashboard.widgets.getWidget(dto.widgetId).expect("widget not found")

    const tableId = widget.table.id
    if (!tableId) {
      throw new Error("table id is required")
    }

    const table = (await this.tableRepository.findOneById(new TableIdVo(tableId))).expect("table not found")

    const spec = dashboard.$duplicateWidget(table, dto)
    if (spec.isNone()) {
      return dashboard
    }
    spec.unwrap().mutate(dashboard)

    await this.dashboardRepository.updateOneById(dashboard, spec.unwrap())

    return dashboard
  }

  async relayoutWidgets(dto: IRelayoutDashboardWidgetsDTO): Promise<Dashboard> {
    const dashboard = (await this.dashboardRepository.findOneById(dto.dashboardId)).expect("dashboard not found")
    const spec = dashboard.$relayoutWidgets(dto)
    if (spec.isNone()) {
      return dashboard
    }
    spec.unwrap().mutate(dashboard)
    await this.dashboardRepository.updateOneById(dashboard, spec.unwrap())
    return dashboard
  }
}
