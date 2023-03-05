import type { ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { SetSortsCommand } from './set-sorts.command.js'

type ISetSortsCommandHandler = ICommandHandler<SetSortsCommand, void>

export class SetSortsCommandHandler implements ISetSortsCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetSortsCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setSorts(command.sorts, command.viewId).unwrap()

    await this.repo.updateOneById(command.tableId, spec)
  }
}
