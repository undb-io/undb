import { createMutateRecordValuesSchema, type IRecordRepository, type ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { ICreateTableOutput } from '../create-table/index.js'
import type { CreateRecordCommand } from './create-record.comand.js'

export class CreateRecordCommandHandler implements ICommandHandler<CreateRecordCommand, ICreateTableOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: CreateRecordCommand): Promise<ICreateTableOutput> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const schema = createMutateRecordValuesSchema(table.schema.fields)

    const record = table.createRecord(schema.parse(command.values))
    await this.recordRepo.insert(record, table.schema.toIdMap())

    return { id: record.id.value }
  }
}
