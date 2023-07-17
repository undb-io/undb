import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteFieldCommand } from './delete-field.command.js'

export class DeleteFieldCommandHandler implements ICommandHandler<DeleteFieldCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DeleteFieldCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.removeField(command.id)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
