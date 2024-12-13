import { eventHandler } from "@undb/cqrs"
import { DashboardTableIdSpecification, injectDashboardRepository, type IDashboardRepository } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { IEventHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { FieldDeletedEvent } from "@undb/table"

@eventHandler(FieldDeletedEvent)
@singleton()
export class DashboardOnFieldDeletedEventHandle implements IEventHandler<FieldDeletedEvent> {
  private readonly logger = createLogger(DashboardOnFieldDeletedEventHandle.name)

  constructor(@injectDashboardRepository() private readonly dashboardRepository: IDashboardRepository) {}

  async handle(event: FieldDeletedEvent): Promise<void> {
    this.logger.debug(event)

    const spec = new DashboardTableIdSpecification(event.payload.tableId)
    const dashboards = await this.dashboardRepository.find(spec)

    for (const dashboard of dashboards) {
      const spec = dashboard.$onFieldDeleted(event.payload.tableId, event.payload.field.id)
      if (spec.isSome()) {
        await this.dashboardRepository.updateOneById(dashboard, spec.unwrap())
      }
    }
  }
}
