import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetFieldDisplayCommand } from './set-field-display.command.js'

type ISetFieldDisplayCommandHandler = ICommandHandler<SetFieldDisplayCommand, void>

export class SetFieldDisplayCommandHandler implements ISetFieldDisplayCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetFieldDisplayCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setFieldDisplay(command.fieldId, command.display)

    if (spec.isSome()) {
      await this.repo.updateOneById(command.tableId, spec.unwrap())
    }
  }
}
