import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetShowSystemFieldsCommand } from './set-show-system-fields.command.js'

type ISetShowSystemFieldsCommandHandler = ICommandHandler<SetShowSystemFieldsCommand, void>

export class SetShowSystemFieldsCommandHandler implements ISetShowSystemFieldsCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetShowSystemFieldsCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setShowSystemFields(command.viewId, command.showSystemFields)

    await this.repo.updateOneById(command.tableId, spec)
  }
}
