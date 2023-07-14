import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetFormFieldVisibilityCommand } from './set-form-field-visibility.command.js'

export class SetFormFieldVisibilityCommandHandler implements ICommandHandler<SetFormFieldVisibilityCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: SetFormFieldVisibilityCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.setFormFieldVisibility(command)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
