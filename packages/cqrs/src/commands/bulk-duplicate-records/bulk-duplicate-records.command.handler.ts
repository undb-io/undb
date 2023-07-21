import type { IRecordRepository, ITableRepository } from '@undb/core'
import { WithRecordIds } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { BulkDuplicateRecordsCommand } from './bulk-duplicate-records.command.js'

export class BulkDuplicateRecordsCommandHandler implements ICommandHandler<BulkDuplicateRecordsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: BulkDuplicateRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const schema = table.schema.toIdMap()

    const records = await this.recordRepo.find(table, WithRecordIds.fromIds(command.ids))

    const duplicated = records.map((record) => record.duplicate(schema))

    await this.recordRepo.insertMany(table, duplicated)
  }
}
