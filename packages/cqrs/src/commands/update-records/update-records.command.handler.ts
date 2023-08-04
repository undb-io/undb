import type { IRLSAuthzService } from '@undb/authz'
import { WithRecordIds, type IRecordRepository, type ITableRepository } from '@undb/core'
import { type ICommandHandler } from '@undb/domain'
import { createUpdateRecordsCommandInput } from './update-records.command.input.js'
import type { UpdateRecordsCommand } from './update-records.command.js'

export class UpdateRecordsCommandHandler implements ICommandHandler<UpdateRecordsCommand, void> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly rls: IRLSAuthzService,
  ) {}

  async execute(command: UpdateRecordsCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const withIds = WithRecordIds.fromIds(command.records.map((r) => r.id))
    const records = await this.recordRepo.find(table, withIds)

    await this.rls.checkMany('update', table, records)

    await createUpdateRecordsCommandInput(table.schema.fields).parseAsync(command)

    const map = new Map(command.records.map((r) => [r.id, r.values]))
    const updates = records.map((record) => ({
      id: record.id.value,
      spec: record.updateRecord(table.schema, map.get(record.id.value) ?? {}),
    }))

    await this.recordRepo.updateManyByIds(table, updates)
  }
}
