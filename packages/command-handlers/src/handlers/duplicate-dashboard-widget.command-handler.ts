import { DuplicateDashboardWidgetCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { injectDashboardService, type IDashboarService } from "@undb/dashboard"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(DuplicateDashboardWidgetCommand)
@singleton()
export class DuplicateDashboardWidgetCommandHandler implements ICommandHandler<DuplicateDashboardWidgetCommand, any> {
  private readonly logger = createLogger(DuplicateDashboardWidgetCommandHandler.name)

  constructor(
    @injectDashboardService()
    private readonly service: IDashboarService,
  ) {}

  async execute(command: DuplicateDashboardWidgetCommand): Promise<any> {
    this.logger.debug(command)

    await this.service.duplicateWidget({
      dashboardId: command.dashboardId,
      widgetId: command.widgetId,
      layout: command.layout,
    })
  }
}
