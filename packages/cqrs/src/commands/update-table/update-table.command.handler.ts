import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { UpdateTableCommand } from './update-table.command.js'

type IUpdateTableCommandHandler = ICommandHandler<UpdateTableCommand, void>

export class UpdateTableCommandHandler implements IUpdateTableCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: UpdateTableCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.id)).unwrap()

    const spec = table.update(command)

    if (spec.isSome()) {
      await this.tableRepo.updateOneById(table.id.value, spec.unwrap())
    }
  }
}
