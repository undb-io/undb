import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { SetKanbanFieldCommand } from './set-kanban-field.command'

type ISetKanbanFieldCommandHandler = ICommandHandler<SetKanbanFieldCommand, void>

export class SetKanbanFieldCommandHandler implements ISetKanbanFieldCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetKanbanFieldCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setKanbanField(command)

    await this.repo.updateOneById(table.id.value, spec)
  }
}
