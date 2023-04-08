import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { UpdateViewNameCommand } from './update-view-name.command.js'

type IUpdateViewNameCommandHandler = ICommandHandler<UpdateViewNameCommand, void>

export class UpdateViewNameCommandHandler implements IUpdateViewNameCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: UpdateViewNameCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.updateViewName(command.view)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
