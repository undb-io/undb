import { injectBaseRepository, withUniqueBase, type IBaseRepository } from "@undb/base"
import { CreateDashboardCommand } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { DashboardFactory, injectDashboardRepository, type IDashboardRepository } from "@undb/dashboard"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
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

    // const spaceId = this.context.mustGetCurrentSpaceId()
    // const nameSpec = new WithDashboardName(DashboardName.from(command.name)).and(new WithDashboardSpaceId(spaceId))
    // const exists = (await this.repository.findOne(nameSpec)).into(null)

    // applyRules(new DashboardNameShouldBeUnique(!!exists))
    const base = (
      await this.baseRepository.findOne(withUniqueBase({ baseId: command.baseId, baseName: command.baseName }).unwrap())
    ).expect("Base not found")

    const spaceId = this.context.mustGetCurrentSpaceId()
    const dashboard = DashboardFactory.create({ ...command, spaceId, baseId: base.id.value })

    await this.repository.insert(dashboard)

    return dashboard.id.value
  }
}
