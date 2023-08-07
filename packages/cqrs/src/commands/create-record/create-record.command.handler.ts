import type { IRLSAuthzService } from '@undb/authz'
import type { ClsStore, IClsService } from '@undb/core'
import { createMutateRecordValuesSchema, type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { ICreateTableOutput } from '../create-table/index.js'
import type { CreateRecordCommand } from './create-record.command.js'

export class CreateRecordCommandHandler implements ICommandHandler<CreateRecordCommand, ICreateTableOutput> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly cls: IClsService<ClsStore>,
    protected readonly rls: IRLSAuthzService,
  ) {}

  async execute(command: CreateRecordCommand): Promise<ICreateTableOutput> {
    const userId = this.cls.get('user.userId')
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const schema = createMutateRecordValuesSchema(table.schema.fields)

    const record = table.createRecord(command.id, schema.parse(command.values), userId)

    await this.rls.check('create', table, record)

    await this.recordRepo.insert(table, record)

    return { id: record.id.value }
  }
}
