import { ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { DuplicateViewCommand } from './duplicate-view.comand.js'

export class DuplicateViewCommandHandler implements ICommandHandler<DuplicateViewCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DuplicateViewCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    // const duplicated = table.duplicateView(table.schema.toIdMap())

    // await this.tableRepo.updateOneById()
  }
}
