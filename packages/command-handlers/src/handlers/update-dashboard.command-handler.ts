import { UpdateDashboardCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { injectDashboardRepository, withUniqueDashboard, type IDashboardRepository } from "@undb/dashboard"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(UpdateDashboardCommand)
@singleton()
export class UpdateDashboardCommandHandler implements ICommandHandler<UpdateDashboardCommand, any> {
  private readonly logger = createLogger(UpdateDashboardCommandHandler.name)

  constructor(
    @injectDashboardRepository()
    private readonly repository: IDashboardRepository,
  ) {}

  async execute(command: UpdateDashboardCommand): Promise<any> {
    this.logger.debug(command)

    const spec = withUniqueDashboard(command).expect("Invalid unique dashboard specification")
    const dashboard = (await this.repository.findOne(spec)).expect("Dashboard not found")

    const updateSpec = dashboard.$update(command)
    if (updateSpec.isSome()) {
      await this.repository.updateOneById(dashboard, updateSpec.unwrap())
    }

    return dashboard.id.value
  }
}
