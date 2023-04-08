import { type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteRecordCommand } from './delete-record.comand.js'

export class DeleteRecordCommandHandler implements ICommandHandler<DeleteRecordCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: DeleteRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    await this.recordRepo.deleteOneById(table.id.value, command.id, table.schema.toIdMap())
  }
}
