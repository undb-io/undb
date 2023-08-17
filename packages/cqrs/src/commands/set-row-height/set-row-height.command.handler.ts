import type { ITableRepository } from '@undb/core'
import type { SetRowHeightCommand } from './set-row-height.command.js'

export class SetRowHeightCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: SetRowHeightCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.setRowHeight(command)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
