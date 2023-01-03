import type { ICommandHandler } from '@egodb/domain'
import type { IRecordRepository } from '../../record/repository'
import type { ITableRepository } from '../../table.repository'
import type { ICreateTableOutput } from '../create-table'
import type { CreateRecordCommand } from './create-record.comand'

export class CreateRecordCommandHandler implements ICommandHandler<CreateRecordCommand, ICreateTableOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: CreateRecordCommand): Promise<ICreateTableOutput> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const record = table.createRecord(command.value)
    await this.recordRepo.insert(record)

    return { id: record.id.value }
  }
}
