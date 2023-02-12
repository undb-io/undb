import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository.js'
import type { ReorderOptionsCommand } from './reorder-options.command.js'

export class ReorderOptionsCommandHandler implements ICommandHandler<ReorderOptionsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: ReorderOptionsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.reorderOption(command)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
