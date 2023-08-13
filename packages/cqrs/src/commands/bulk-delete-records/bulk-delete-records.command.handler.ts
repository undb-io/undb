import type { IRLSAuthzService } from '@undb/authz'
import { WithRecordIds, WithRecordTableId, type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { BulkDeleteRecordsCommand } from './bulk-delete-records.command.js'

export class BulkDeleteRecordsCommandHandler implements ICommandHandler<BulkDeleteRecordsCommand, void> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly rls: IRLSAuthzService,
  ) {}

  async execute(command: BulkDeleteRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const records = await this.recordRepo.find(
      table,
      WithRecordTableId.fromString(table.id.value).unwrap().and(WithRecordIds.fromIds(command.ids)),
    )

    await this.rls.checkMany('delete', table, records)

    await this.recordRepo.deleteManyByIds(table, command.ids)
  }
}
