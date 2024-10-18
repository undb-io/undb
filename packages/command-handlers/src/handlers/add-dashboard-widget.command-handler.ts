import { AddDashboardWidgetCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { injectDashboardService, type IDashboarService } from "@undb/dashboard"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(AddDashboardWidgetCommand)
@singleton()
export class AddDashboardWidgetCommandHandler implements ICommandHandler<AddDashboardWidgetCommand, any> {
  private readonly logger = createLogger(AddDashboardWidgetCommandHandler.name)

  constructor(
    @injectDashboardService()
    private readonly service: IDashboarService,
  ) {}

  async execute(command: AddDashboardWidgetCommand): Promise<any> {
    this.logger.debug(command)

    await this.service.addWidget({
      dashboardId: command.dashboardId,
      widget: command.widget,
      layout: command.layout,
    })
  }
}
