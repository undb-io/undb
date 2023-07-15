import { type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { BulkDeleteRecordsCommand } from './bulk-delete-records.command.js'

export class BulkDeleteRecordsCommandHandler implements ICommandHandler<BulkDeleteRecordsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: BulkDeleteRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    await this.recordRepo.deleteManyByIds(table, command.ids, table.schema.toIdMap())
  }
}
