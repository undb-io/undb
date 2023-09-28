import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DuplicateViewCommand } from './duplicate-view.command.js'

export class DuplicateViewCommandHandler implements ICommandHandler<DuplicateViewCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DuplicateViewCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.duplicateView(command.id, command.name)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
