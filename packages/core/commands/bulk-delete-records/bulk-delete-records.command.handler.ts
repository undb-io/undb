import type { ICommandHandler } from '@egodb/domain'
import type { IRecordRepository } from '../../record/record.repository.js'
import type { ITableRepository } from '../../table.repository.js'
import type { BulkDeleteRecordsCommand } from './bulk-delete-records.comand.js'

export class BulkDeleteRecordsCommandHandler implements ICommandHandler<BulkDeleteRecordsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: BulkDeleteRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    await this.recordRepo.deleteManyByIds(table.id.value, command.ids, table.schema.toIdMap())
  }
}
