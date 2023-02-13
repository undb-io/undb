import { ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { DeleteOptionCommand } from './delete-option.comand.js'

export class DeleteOptionCommandHandler implements ICommandHandler<DeleteOptionCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DeleteOptionCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.removeOption(command.fieldId, command.id)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
