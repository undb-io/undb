import { ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { DuplicateViewCommand } from './duplicate-view.comand.js'

export class DuplicateViewCommandHandler implements ICommandHandler<DuplicateViewCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DuplicateViewCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.duplicateView(command.id)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
