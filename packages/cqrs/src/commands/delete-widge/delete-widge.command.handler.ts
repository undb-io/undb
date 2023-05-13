import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteWidgeCommand } from './delete-widge.command.js'

type IDeleteWidgeCommandHandler = ICommandHandler<DeleteWidgeCommand, void>

export class DeleteWidgeCommandHandler implements IDeleteWidgeCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DeleteWidgeCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.deleteWidge(command.viewId, command.widgeId)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
