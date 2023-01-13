import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { IUnderlyingTableManager } from '../../underlying-table.manager'
import type { DeleteOptionCommand } from './delete-option.comand'

export class DeleteOptionCommandHandler implements ICommandHandler<DeleteOptionCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly tm: IUnderlyingTableManager) {}

  async execute(command: DeleteOptionCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.removeOption(command.fieldId, command.id)

    await this.tableRepo.updateOneById(table.id.value, spec)
    await this.tm.update(table, spec)
  }
}
