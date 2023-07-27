import { type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { RestoreRecordCommand } from './restore-record.command.js'

export class RestoreRecordCommandHandler implements ICommandHandler<RestoreRecordCommand, void> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
  ) {}

  async execute(command: RestoreRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    await this.recordRepo.restoreOneById(table, command.id)
  }
}
