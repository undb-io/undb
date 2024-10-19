import { createLogger } from "@undb/logger"
import type { FieldDeletedEvent } from "@undb/table"
import type { Dashboard } from "../dashboard.do"
import { injectDashboardRepository, type IDashboardRepository } from "../dashboard.repository"

export interface IDashboardEventService {
  onFieldDeleted(dashboard: Dashboard, event: FieldDeletedEvent): Promise<void>
}

export class DashboardEventService implements IDashboardEventService {
  private readonly logger = createLogger(DashboardEventService.name)

  constructor(
    @injectDashboardRepository()
    private readonly dashboardRepository: IDashboardRepository,
  ) {}

  async onFieldDeleted(dashboard: Dashboard, event: FieldDeletedEvent): Promise<void> {
    this.logger.debug(event)
  }
}
