import type { ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { SetFieldSortCommand } from './set-field-sort.command.js'

type ISetFieldSortCommandHandler = ICommandHandler<SetFieldSortCommand, void>

export class SetFieldSortCommandHandler implements ISetFieldSortCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetFieldSortCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setFieldSort(command.fieldId, command.direction, command.viewId).unwrap()

    await this.repo.updateOneById(command.tableId, spec)
  }
}
