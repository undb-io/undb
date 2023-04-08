import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { MoveViewCommand } from './move-view.command.js'

type IMoveViewCommandHandler = ICommandHandler<MoveViewCommand, void>

export class MoveViewCommandHandler implements IMoveViewCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: MoveViewCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.moveView(command)
    await this.repo.updateOneById(command.tableId, spec)
  }
}
