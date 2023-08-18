import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetFormFieldFilterCommand } from './set-form-field-filter.command.js'

export class SetFormFieldFilterCommandHandler implements ICommandHandler<SetFormFieldFilterCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: SetFormFieldFilterCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.setFormFieldFilter(command)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
