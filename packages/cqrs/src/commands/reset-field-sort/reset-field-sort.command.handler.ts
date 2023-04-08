import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { ResetFieldSortCommand } from './reset-field-sort.command.js'

type IResetFieldSortCommandHandler = ICommandHandler<ResetFieldSortCommand, void>

export class ResetFieldSortCommandHandler implements IResetFieldSortCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: ResetFieldSortCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.resetFieldSort(command.fieldId, command.viewId).unwrap()

    await this.repo.updateOneById(command.tableId, spec)
  }
}
