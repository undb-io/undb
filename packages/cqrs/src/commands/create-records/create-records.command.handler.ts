import { type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { CreateRecordsCommand } from './create-records.command.js'
import { createCreateRecordsCommandInput } from './create-records.command.input.js'

export class CreateRecordsCommandHandler implements ICommandHandler<CreateRecordsCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: CreateRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    await createCreateRecordsCommandInput(table.schema.fields).parseAsync(command)

    const records = table.createRecords(command.records)
    await this.recordRepo.insertMany(table, records, table.schema.toIdMap())
  }
}
