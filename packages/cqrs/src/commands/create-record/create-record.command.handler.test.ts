import { IRLSAuthzService } from '@undb/authz'
import {
  ClsStore,
  IClsService,
  IMutateRecordValueSchema,
  IRecordRepository,
  ITableRepository,
  Record,
  Table,
  WithTableSchema,
  createTestRecord,
  createTestTable,
} from '@undb/core'
import { identity } from 'lodash-es'
import { None, Some } from 'oxide.ts'
import { SpyInstance } from 'vitest'
import { MockProxy, mock, mockDeep } from 'vitest-mock-extended'
import { CreateRecordCommand } from './create-record.command'
import { CreateRecordCommandHandler } from './create-record.command.handler'

describe('CreateRecordCommandHandler', () => {
  let table: Table
  let record: Record
  let spy: SpyInstance
  let command: CreateRecordCommand
  let values: MockProxy<IMutateRecordValueSchema>
  let handler: CreateRecordCommandHandler
  let tableRepo: MockProxy<ITableRepository>
  let recordRepo: IRecordRepository
  let cls: MockProxy<IClsService<ClsStore>>
  let rls: IRLSAuthzService
  beforeEach(() => {
    const ctx = mockDeep<ClsStore>({ t: identity })
    table = createTestTable(WithTableSchema.from([{ id: 'fld1', name: 'string', type: 'string' }], ctx))
    record = createTestRecord()
    spy = vi.spyOn(table, 'createRecord')
    values = { fld1: 'fld123' }
    tableRepo = mock<ITableRepository>()
    recordRepo = mock<IRecordRepository>()
    cls = mock<IClsService<ClsStore>>()
    rls = mock<IRLSAuthzService>()

    command = new CreateRecordCommand({ tableId: table.id.value, values })
    handler = new CreateRecordCommandHandler(tableRepo, recordRepo, cls, rls)
  })
  test('create record success', async () => {
    cls.get.calledWith('user.userId').mockReturnValue('usr123')
    tableRepo.findOneById.calledWith(table.id.value).mockResolvedValue(Some(table))
    spy.mockReturnValue(record)

    const { id } = await handler.execute(command)

    expect(rls.check).toHaveBeenCalledWith('create', table, record)

    expect(recordRepo.insert).toHaveBeenCalledWith(table, record)

    expect(id).toEqual(record.id.value)
  })
  test('findOneById failed', async () => {
    cls.get.calledWith('user.userId').mockReturnValue('usr123')
    tableRepo.findOneById.mockResolvedValue(None)
    spy.mockReturnValue(record)

    await expect(handler.execute(command)).rejects.toThrowErrorMatchingInlineSnapshot(
      '"Failed to unwrap Option (found None)"',
    )

    expect(spy).not.toHaveBeenCalled()

    expect(rls.check).not.toHaveBeenCalled()

    expect(recordRepo.insert).not.toHaveBeenCalled()
  })
})
