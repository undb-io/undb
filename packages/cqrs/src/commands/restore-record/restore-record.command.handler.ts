import type { IRLSAuthzService } from '@undb/authz'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { RestoreRecordCommand } from './restore-record.command.js'

export class RestoreRecordCommandHandler implements ICommandHandler<RestoreRecordCommand, void> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly rls: IRLSAuthzService,
  ) {}

  async execute(command: RestoreRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const record = (await this.recordRepo.findDeletedOneById(table, command.id)).unwrap()

    await this.rls.check('create', table, record)

    await this.recordRepo.restoreOneById(table, command.id)
  }
}
