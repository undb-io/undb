import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { UpdateVisualizationCommand } from './update-visualization.command.js'

type IUpdateVisualizationCommandHandler = ICommandHandler<UpdateVisualizationCommand, void>

export class UpdateVisualizationCommandHandler implements IUpdateVisualizationCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: UpdateVisualizationCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.updateVisualization(command.visualization)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
