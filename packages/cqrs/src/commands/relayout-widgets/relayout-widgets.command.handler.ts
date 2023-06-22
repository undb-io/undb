import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { RelayoutWidgetsCommand } from './relayout-widgets.command.js'

type IRelayoutWidgetsCommandHandler = ICommandHandler<RelayoutWidgetsCommand, void>

export class RelayoutWidgetsCommandHandler implements IRelayoutWidgetsCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: RelayoutWidgetsCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.relayoutWidgets(command.viewId, command.widgets)
    await this.repo.updateOneById(command.tableId, spec)
  }
}
