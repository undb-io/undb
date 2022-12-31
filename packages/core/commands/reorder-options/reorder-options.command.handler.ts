import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { ReorderOptionsCommand } from './reorder-options.command'

export class ReorderOptionsCommandHandler implements ICommandHandler<ReorderOptionsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: ReorderOptionsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
  }
}
