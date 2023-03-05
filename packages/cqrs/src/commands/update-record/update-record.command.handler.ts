import type { IRecordRepository, ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type * as updateRecordCommandJs from './update-record.command.js'

export class UpdateRecordCommandHandler implements ICommandHandler<updateRecordCommandJs.UpdateRecordCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: updateRecordCommandJs.UpdateRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const record = (await this.recordRepo.findOneById(table.id.value, command.id, table.schema.toIdMap())).unwrap()

    const spec = record.updateRecord(table.schema, command.value)
    await this.recordRepo.updateOneById(table.id.value, command.id, table.schema.toIdMap(), spec)
  }
}
