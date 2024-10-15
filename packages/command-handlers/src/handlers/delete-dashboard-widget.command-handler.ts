import { DeleteDashboardWidgetCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { injectDashboardRepository, type IDashboardRepository } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"

@commandHandler(DeleteDashboardWidgetCommand)
@singleton()
export class DeleteDashboardWidgetCommandHandler implements ICommandHandler<DeleteDashboardWidgetCommand, void> {
  constructor(
    @injectDashboardRepository()
    private readonly repo: IDashboardRepository,
  ) {}

  async execute(command: DeleteDashboardWidgetCommand): Promise<void> {
    const dashboard = (await this.repo.findOneById(command.dashboardId)).expect("dashboard not found")

    const spec = dashboard.widgets.$deleteWidget(command.widgetId)
    if (spec.isNone()) {
      return
    }

    spec.unwrap().mutate(dashboard)
    await this.repo.updateOneById(dashboard, spec.unwrap())
  }
}
