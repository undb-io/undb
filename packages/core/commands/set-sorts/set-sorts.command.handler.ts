import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { SetSortsCommand } from './set-sorts.command'

type ISetSortsCommandHandler = ICommandHandler<SetSortsCommand, void>

export class SetSortsCommandHandler implements ISetSortsCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetSortsCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    // const spec = table.setFilter(command.filter, command.viewKey).unwrap()
    // await this.repo.updateOneById(command.tableId, spec)
  }
}
