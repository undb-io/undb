import type { ICommandHandler } from '@egodb/domain'
import { WithRecordIds } from '../../record/index.js'
import type { IRecordRepository } from '../../record/record.repository.js'
import type { ITableRepository } from '../../table.repository.js'
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
