import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetFiltersCommand } from './set-filters.command.js'

type ISetFilterCommandHandler = ICommandHandler<SetFiltersCommand, void>

export class SetFiltersCommandHandler implements ISetFilterCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetFiltersCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setFilter(command.filter, command.viewId).unwrap()
    await this.repo.updateOneById(command.tableId, spec)
  }
}
