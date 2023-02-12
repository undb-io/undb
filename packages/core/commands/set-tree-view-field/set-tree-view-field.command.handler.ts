import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository.js'
import type { SetTreeViewFieldCommand } from './set-tree-view-field.command.js'

type ISetTreeViewFieldCommandHandler = ICommandHandler<SetTreeViewFieldCommand, void>

export class SetTreeViewFieldCommandHandler implements ISetTreeViewFieldCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetTreeViewFieldCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setTreeViewField(command)

    await this.repo.updateOneById(table.id.value, spec)
  }
}
