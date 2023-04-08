import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetKanbanFieldCommand } from './set-kanban-field.command.js'

type ISetKanbanFieldCommandHandler = ICommandHandler<SetKanbanFieldCommand, void>

export class SetKanbanFieldCommandHandler implements ISetKanbanFieldCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetKanbanFieldCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setKanbanField(command)

    await this.repo.updateOneById(table.id.value, spec)
  }
}
