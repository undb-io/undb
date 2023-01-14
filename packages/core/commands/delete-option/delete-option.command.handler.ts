import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { DeleteOptionCommand } from './delete-option.comand'

export class DeleteOptionCommandHandler implements ICommandHandler<DeleteOptionCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DeleteOptionCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.removeOption(command.fieldKey, command.id)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
