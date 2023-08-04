import type { IRLSAuthzService } from '@undb/authz'
import type { IRecordRepository, ITableRepository } from '@undb/core'
import { WithRecordIds } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { BulkDuplicateRecordsCommand } from './bulk-duplicate-records.command.js'

export class BulkDuplicateRecordsCommandHandler implements ICommandHandler<BulkDuplicateRecordsCommand, void> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly rls: IRLSAuthzService,
  ) {}

  async execute(command: BulkDuplicateRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const schema = table.schema.toIdMap()

    const records = await this.recordRepo.find(table, WithRecordIds.fromIds(command.ids))

    await this.rls.checkMany('create', table, records)

    const duplicated = records.map((record) => record.duplicate(schema))

    await this.recordRepo.insertMany(table, duplicated)
  }
}
