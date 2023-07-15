import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DuplicateFieldCommand } from './duplicate-field.command.js'

export class DuplicateFieldCommandHandler implements ICommandHandler<DuplicateFieldCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DuplicateFieldCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.duplicateField(command)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
