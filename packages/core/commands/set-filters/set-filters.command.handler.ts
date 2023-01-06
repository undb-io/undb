import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { SetFitlersCommand } from './set-filters.command'

type ISetFilterCommandHandler = ICommandHandler<SetFitlersCommand, void>

export class SetFiltersCommandHandler implements ISetFilterCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetFitlersCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setFilter(command.filter, command.viewId).unwrap()
    await this.repo.updateOneById(command.tableId, spec)
  }
}
