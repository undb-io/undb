import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { UpdateVirsualizationCommand } from './update-virsualization.command.js'

type IUpdateVirsualizationCommandHandler = ICommandHandler<UpdateVirsualizationCommand, void>

export class UpdateVirsualizationCommandHandler implements IUpdateVirsualizationCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: UpdateVirsualizationCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.updateVirsualization(command.virsualization)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
