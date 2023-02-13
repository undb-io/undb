import { ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { DeleteTableCommand } from './delete-table.comand.js'

export class DeleteTableCommandHandler implements ICommandHandler<DeleteTableCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DeleteTableCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.id)).unwrap()

    await this.tableRepo.deleteOneById(table.id.value)
  }
}
