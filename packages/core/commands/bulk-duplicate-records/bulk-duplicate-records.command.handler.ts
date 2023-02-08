import type { ICommandHandler } from '@egodb/domain'
import type { IRecordRepository } from '../../record/record.repository'
import type { ITableRepository } from '../../table.repository'
import type { BulkDuplicateRecordsCommand } from './bulk-duplicate-records.comand'

export class BulkDuplicateRecordsCommandHandler implements ICommandHandler<BulkDuplicateRecordsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: BulkDuplicateRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
  }
}
