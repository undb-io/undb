import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { RelayoutWidgesCommand } from './relayout-widges.command.js'

type IRelayoutWidgesCommandHandler = ICommandHandler<RelayoutWidgesCommand, void>

export class RelayoutWidgesCommandHandler implements IRelayoutWidgesCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: RelayoutWidgesCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.relayoutWidges(command.viewId, command.widges)
    await this.repo.updateOneById(command.tableId, spec)
  }
}
