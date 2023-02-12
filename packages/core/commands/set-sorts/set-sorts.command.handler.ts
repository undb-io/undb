import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository.js'
import type { SetSortsCommand } from './set-sorts.command.js'

type ISetSortsCommandHandler = ICommandHandler<SetSortsCommand, void>

export class SetSortsCommandHandler implements ISetSortsCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetSortsCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setSorts(command.sorts, command.viewKey).unwrap()

    await this.repo.updateOneById(command.tableId, spec)
  }
}
