import type { ICommandHandler } from '@egodb/domain'
import type { IRecordRepository } from '../../record/record.repository'
import type { ITableRepository } from '../../table.repository'
import type { BulkDeleteRecordsCommand } from './bulk-delete-records.comand'

export class BulkDeleteRecordsCommandHandler implements ICommandHandler<BulkDeleteRecordsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: BulkDeleteRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    await this.recordRepo.deleteManyByIds(table.id.value, command.ids, table.schema.toIdMap())
  }
}
