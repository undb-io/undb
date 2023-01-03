import type { ICommandHandler } from '@egodb/domain'
import type { IRecordRepository } from '../../record/repository'
import type { ITableRepository } from '../../table.repository'
import type { UpdateRecordCommand } from './update-record.comand'

export class UpdateRecordCommandHandler implements ICommandHandler<UpdateRecordCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: UpdateRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    // const record = table.createRecord(command)
    // await this.recordRepo.insert(record)
  }
}
