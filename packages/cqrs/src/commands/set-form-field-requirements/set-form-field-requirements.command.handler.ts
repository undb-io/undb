import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetFormFieldRequirementsCommand } from './set-form-field-requirements.command.js'

export class SetFormFieldRequirementsCommandHandler implements ICommandHandler<SetFormFieldRequirementsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: SetFormFieldRequirementsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.setFormFieldRequirements(command)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
