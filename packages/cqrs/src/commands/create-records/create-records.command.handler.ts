import type { IRLSAuthzService } from '@undb/authz'
import type { ClsStore, IClsService } from '@undb/core'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { createCreateRecordsCommandInput } from './create-records.command.input.js'
import type { CreateRecordsCommand } from './create-records.command.js'

export class CreateRecordsCommandHandler implements ICommandHandler<CreateRecordsCommand, void> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly cls: IClsService<ClsStore>,
    protected readonly rls: IRLSAuthzService,
  ) {}

  async execute(command: CreateRecordsCommand): Promise<void> {
    const userId = this.cls.get('user.userId')
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    await createCreateRecordsCommandInput(table.schema.fields).parseAsync(command)

    const records = table.createRecords(command.records, userId)

    await this.rls.checkMany('create', table, records)

    await this.recordRepo.insertMany(table, records)
  }
}
