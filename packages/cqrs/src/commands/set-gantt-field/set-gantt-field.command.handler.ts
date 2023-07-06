import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetGanttFieldCommand } from './set-gantt-field.command.js'

type ISetGanttFieldCommandHandler = ICommandHandler<SetGanttFieldCommand, void>

export class SetGanttFieldCommandHandler implements ISetGanttFieldCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetGanttFieldCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setGanttField(command)

    await this.repo.updateOneById(table.id.value, spec)
  }
}
