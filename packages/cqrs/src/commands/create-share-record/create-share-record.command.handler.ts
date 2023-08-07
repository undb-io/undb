import type { IRLSAuthzService } from '@undb/authz'
import type { ClsStore, IClsService } from '@undb/core'
import { createMutateRecordValuesSchema, type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { withShare, type IShareGuardService } from '@undb/integrations'
import type { ICreateTableOutput } from '../create-table/index.js'
import type { CreateShareRecordCommand } from './create-share-record.comand.js'

export class CreateShareRecordCommandHandler implements ICommandHandler<CreateShareRecordCommand, ICreateTableOutput> {
  constructor(
    protected readonly guard: IShareGuardService,
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly rls: IRLSAuthzService,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(command: CreateShareRecordCommand): Promise<ICreateTableOutput> {
    await this.guard.verify(withShare(command.target.type, command.target.id))

    const userId = this.cls.get('user.userId')

    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const form = command.target.type === 'form' ? table.forms.getById(command.target.id).unwrap() : undefined
    const schema = createMutateRecordValuesSchema(table.schema.fields, undefined, form?.fields)

    const record = table.createRecord(command.id, schema.parse(command.values), userId)

    await this.rls.check('create', table, record)

    await this.recordRepo.insert(table, record)

    return { id: record.id.value }
  }
}
