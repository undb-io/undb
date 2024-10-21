import { eventHandler } from "@undb/cqrs"
import { DashboardTableIdSpecification, injectDashboardRepository, type IDashboardRepository } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { IEventHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableDeletedEvent } from "@undb/table"

@eventHandler(TableDeletedEvent)
@singleton()
export class DashboardOnTableDeletedEventHandle implements IEventHandler<TableDeletedEvent> {
  private readonly logger = createLogger(DashboardOnTableDeletedEventHandle.name)

  constructor(@injectDashboardRepository() private readonly dashboardRepository: IDashboardRepository) {}

  async handle(event: TableDeletedEvent): Promise<void> {
    this.logger.debug(event)

    const tableId = event.payload.table.id

    const spec = new DashboardTableIdSpecification(tableId)
    const dashboards = await this.dashboardRepository.find(spec)

    for (const dashboard of dashboards) {
      const spec = dashboard.$onTableDeleted(tableId)
      if (spec.isSome()) {
        await this.dashboardRepository.updateOneById(dashboard, spec.unwrap())
      }
    }
  }
}
