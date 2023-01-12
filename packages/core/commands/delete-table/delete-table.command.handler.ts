import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { IUnderlyingTableManager } from '../../underlying-table.manager'
import type { DeleteTableCommand } from './delete-table.comand'

export class DeleteTableCommandHandler implements ICommandHandler<DeleteTableCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly tm: IUnderlyingTableManager) {}

  async execute(command: DeleteTableCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.id)).unwrap()

    await this.tableRepo.deleteOneById(table.id.value)
    await this.tm.delete(table)
  }
}
