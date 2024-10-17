import { injectBaseRepository, withUniqueBase, type IBaseRepository } from "@undb/base"
import { CreateDashboardCommand } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import {
  DashboardBaseIdSpecification,
  DashboardFactory,
  DashboardNameShouldBeUnique,
  injectDashboardRepository,
  type IDashboardRepository,
} from "@undb/dashboard"
import { singleton } from "@undb/di"
import { applyRules, type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(CreateDashboardCommand)
@singleton()
export class CreateDashboardCommandHandler implements ICommandHandler<CreateDashboardCommand, any> {
  private readonly logger = createLogger(CreateDashboardCommandHandler.name)

  constructor(
    @injectDashboardRepository()
    private readonly repository: IDashboardRepository,
    @injectContext()
    private readonly context: IContext,
    @injectBaseRepository()
    private readonly baseRepository: IBaseRepository,
  ) {}

  async execute(command: CreateDashboardCommand): Promise<any> {
    this.logger.debug(command)

    const base = (
      await this.baseRepository.findOne(withUniqueBase({ baseId: command.baseId, baseName: command.baseName }).unwrap())
    ).expect("Base not found")

    const baseIdSpec = new DashboardBaseIdSpecification(base.id.value)
    const baseDashboards = await this.repository.find(baseIdSpec)
    const names = baseDashboards.map((dashboard) => dashboard.name.value).concat(command.name)
    applyRules(new DashboardNameShouldBeUnique(names))

    const spaceId = this.context.mustGetCurrentSpaceId()
    const dashboard = DashboardFactory.create({ ...command, spaceId, baseId: base.id.value })

    await this.repository.insert(dashboard)

    return dashboard.id.value
  }
}
