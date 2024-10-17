import { RelayoutDashboardWidgetsCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { injectDashboardService, type IDashboarService } from "@undb/dashboard"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(RelayoutDashboardWidgetsCommand)
@singleton()
export class RelayoutDashboardWidgetsCommandHandler implements ICommandHandler<RelayoutDashboardWidgetsCommand, any> {
  private readonly logger = createLogger(RelayoutDashboardWidgetsCommandHandler.name)

  constructor(
    @injectDashboardService()
    private readonly service: IDashboarService,
  ) {}

  async execute(command: RelayoutDashboardWidgetsCommand): Promise<any> {
    this.logger.debug(command)

    await this.service.relayoutWidgets({
      dashboardId: command.dashboardId,
      layout: command.layout,
    })
  }
}
