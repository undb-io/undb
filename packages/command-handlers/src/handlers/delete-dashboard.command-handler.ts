import { DeleteDashboardCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { injectDashboardRepository, type IDashboardRepository } from "@undb/dashboard"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(DeleteDashboardCommand)
@singleton()
export class DeleteDashboardCommandHandler implements ICommandHandler<DeleteDashboardCommand, any> {
  private readonly logger = createLogger(DeleteDashboardCommandHandler.name)

  constructor(
    @injectDashboardRepository()
    private readonly repository: IDashboardRepository,
  ) {}

  async execute(command: DeleteDashboardCommand): Promise<any> {
    this.logger.debug(command)

    const dashboard = (await this.repository.findOneById(command.id)).expect("Dashboard not found")

    await this.repository.deleteOneById(dashboard.id.value)

    return dashboard.id.value
  }
}
