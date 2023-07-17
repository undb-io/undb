import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteViewCommand } from './delete-view.command.js'

export class DeleteViewCommandHandler implements ICommandHandler<DeleteViewCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DeleteViewCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.removeView(command.id)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
