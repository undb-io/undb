import type { ICommandHandler } from '@egodb/domain'
import type { IRecordRepository } from '../../record/repository'
import type { ITableRepository } from '../../table.repository'
import type { UpdateRecordCommand } from './update-record.command'

export class UpdateRecordCommandHandler implements ICommandHandler<UpdateRecordCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: UpdateRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const record = (await this.recordRepo.findOneById(command.id)).unwrap()

    const spec = record.updateRecord(table.schema, command.value)
    await this.recordRepo.updateOneById(command.id, spec)
  }
}
