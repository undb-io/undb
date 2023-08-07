import type { IRLSAuthzService } from '@undb/authz'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteRecordCommand } from './delete-record.command.js'

export class DeleteRecordCommandHandler implements ICommandHandler<DeleteRecordCommand, void> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly rls: IRLSAuthzService,
  ) {}

  async execute(command: DeleteRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const record = (await this.recordRepo.findOneById(table, command.id)).unwrap()

    await this.rls.check('delete', table, record)

    await this.recordRepo.deleteOneById(table, command.id)
  }
}
