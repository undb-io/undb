import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { MoveFieldCommand } from './move-field.command.js'

type IMoveFieldCommandHandler = ICommandHandler<MoveFieldCommand, void>

export class MoveFieldCommandHandler implements IMoveFieldCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: MoveFieldCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.moveField(command)
    await this.repo.updateOneById(command.tableId, spec)
  }
}
