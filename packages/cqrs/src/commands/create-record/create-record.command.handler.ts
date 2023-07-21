import { createMutateRecordValuesSchema, type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { ICreateTableOutput } from '../create-table/index.js'
import type { CreateRecordCommand } from './create-record.command.js'

export class CreateRecordCommandHandler implements ICommandHandler<CreateRecordCommand, ICreateTableOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: CreateRecordCommand): Promise<ICreateTableOutput> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const schema = createMutateRecordValuesSchema(table.schema.fields)

    const record = table.createRecord(command.id, schema.parse(command.values))
    await this.recordRepo.insert(table, record)

    return { id: record.id.value }
  }
}
