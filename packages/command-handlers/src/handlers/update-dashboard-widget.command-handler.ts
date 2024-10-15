import { UpdateDashboardWidgetCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { injectDashboardRepository, type IDashboardRepository } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"

@commandHandler(UpdateDashboardWidgetCommand)
@singleton()
export class UpdateDashboardWidgetCommandHandler implements ICommandHandler<UpdateDashboardWidgetCommand, void> {
  constructor(
    @injectDashboardRepository()
    private readonly repo: IDashboardRepository,
  ) {}

  async execute(command: UpdateDashboardWidgetCommand): Promise<void> {
    const dashboard = (await this.repo.findOneById(command.id)).expect("dashboard not found")

    const spec = dashboard.widgets.$updateWidget(command)
    if (spec.isNone()) {
      return
    }

    spec.unwrap().mutate(dashboard)
    await this.repo.updateOneById(dashboard, spec.unwrap())
  }
}
