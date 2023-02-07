import type { ICommandHandler } from '@egodb/domain'
import type { IRecordRepository } from '../../record/record.repository'
import type { ITableRepository } from '../../table.repository'
import type { BulkDeleteRecordCommand } from './bulk-delete-record.comand'

export class BulkDeleteRecordCommandHandler implements ICommandHandler<BulkDeleteRecordCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: BulkDeleteRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    // await this.recordRepo.deleteOneById(table.id.value, command.id, table.schema.toIdMap())
  }
}
