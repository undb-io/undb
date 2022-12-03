import type { ICommandHandler } from '@egodb/domain/dist'
import type { IRecordRepository } from '../../record/repository'
import type { ITableRepository } from '../../repository'
import type { ICreateTableOutput } from '../create-table'
import type { CreateRecordCommand } from './create-record.comand'

export class CreateRecordCommandHandler implements ICommandHandler<CreateRecordCommand, ICreateTableOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}
  async execute(command: CreateRecordCommand): Promise<ICreateTableOutput> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const record = table.createRecord(command)
    await this.recordRepo.insert(record)

    console.log(record)

    return { id: record.id.value }
  }
}
