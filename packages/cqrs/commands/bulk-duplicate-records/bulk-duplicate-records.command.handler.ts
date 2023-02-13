import { IRecordRepository, ITableRepository, WithRecordIds } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { BulkDuplicateRecordsCommand } from './bulk-duplicate-records.comand.js'

export class BulkDuplicateRecordsCommandHandler implements ICommandHandler<BulkDuplicateRecordsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: BulkDuplicateRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const schema = table.schema.toIdMap()

    const records = await this.recordRepo.find(table.id.value, WithRecordIds.fromIds(command.ids), schema)

    const duplicated = records.map((record) => record.duplicate(schema))

    await this.recordRepo.insertMany(duplicated, schema)
  }
}
