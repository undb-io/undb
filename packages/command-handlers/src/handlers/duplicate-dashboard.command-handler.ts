import { DuplicateDashboardCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { DashboardBaseIdSpecification, injectDashboardRepository, type IDashboardRepository } from "@undb/dashboard"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(DuplicateDashboardCommand)
@singleton()
export class DuplicateDashboardCommandHandler implements ICommandHandler<DuplicateDashboardCommand, any> {
  private readonly logger = createLogger(DuplicateDashboardCommandHandler.name)

  constructor(
    @injectDashboardRepository()
    private readonly repository: IDashboardRepository,
  ) {}

  async execute(command: DuplicateDashboardCommand): Promise<any> {
    this.logger.debug(command)

    const dashboard = (await this.repository.findOneById(command.id)).expect("Dashboard not found")

    const findSpec = new DashboardBaseIdSpecification(dashboard.baseId)
    const dashboards = await this.repository.find(findSpec)
    const dashboardNames = dashboards.map((d) => d.name.value)

    const spec = dashboard.$duplicate(command, dashboardNames)
    await this.repository.insert(spec.duplicatedDashboard)

    return dashboard.id.value
  }
}
