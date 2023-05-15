import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { CreateWidgeCommand } from './create-widge.command.js'

type ICreateWidgeCommandHandler = ICommandHandler<CreateWidgeCommand, void>

export class CreateWidgeCommandHandler implements ICreateWidgeCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: CreateWidgeCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.createWidge(command.viewId, command.widge)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
