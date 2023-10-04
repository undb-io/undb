import {
  BaseFactory,
  BaseId,
  BaseRepository,
  ClsStore,
  IClsService,
  IRecordRepository,
  ITableRepository,
  Table,
  TableId,
  createTestTable,
} from '@undb/core'
import { MockProxy, mock } from 'vitest-mock-extended'
import { CreateBaseCommand } from './create-base.command'
import { CreateBaseCommandHandler } from './create-base.command.handler'
import { SpyInstance } from 'vitest'
import { Option, Some } from 'oxide.ts'

describe('create base command handler test', () => {
  let cls: MockProxy<IClsService<ClsStore>>
  let repo: MockProxy<BaseRepository>
  let tableRepo: MockProxy<ITableRepository>
  let recordRepo: MockProxy<IRecordRepository>
  let command: CreateBaseCommand
  let handler: CreateBaseCommandHandler
  let spy: SpyInstance
  let tables: Table[]
  const table1 = createTestTable()
  table1.id = TableId.fromOrCreate('tbl1')
  const table2 = createTestTable()
  table2.id = TableId.fromOrCreate('tbl2')
  const tbl2Spy = vi.spyOn(table2, 'moveToBase')
  const tbl1Spy = vi.spyOn(table1, 'moveToBase')

  beforeEach(() => {
    cls = mock<IClsService<ClsStore>>()
    repo = mock<BaseRepository>()
    tableRepo = mock<ITableRepository>()
    recordRepo = mock<IRecordRepository>()
    spy = vi.spyOn(BaseFactory, 'new')
    handler = new CreateBaseCommandHandler(cls, repo, tableRepo, recordRepo)
  })

  test('Successfully create base and updated the table', async () => {
    tables = [table1]
    command = new CreateBaseCommand({ name: 'baseName1', tableIds: ['tbl1'] })
    tableRepo.findOneById.mockResolvedValue(Some(table1))
    await handler.execute(command)
    const base = spy.mock.results[0].value
    expect(repo.insert).toHaveBeenCalledWith(base)
    const spec = tbl1Spy.mock.results[0].value
    expect(tableRepo.updateOneById).toHaveBeenCalledWith(table1.id.value, spec.unwrap())
  })

  test('Successfully create base without the need to update the table', async () => {
    tables = [table1]
    table1.baseId = Option(BaseId.fromOrCreate('basId1'))
    command = new CreateBaseCommand({ name: 'baseName1', id: 'basId1', tableIds: ['tbl1'] })
    tableRepo.findOneById.mockResolvedValue(Some(table1))
    await handler.execute(command)
    const base = spy.mock.results[0].value
    expect(repo.insert).toHaveBeenCalledWith(base)
    expect(tableRepo.updateOneById).not.toHaveBeenCalled()
  })

  test('Successfully create base and updated the table once time', async () => {
    tables = [table1, table2]
    table1.baseId = Option(BaseId.fromOrCreate('basId1'))
    command = new CreateBaseCommand({ name: 'baseName1', id: 'basId1', tableIds: ['tbl1', 'tbl2'] })
    tableRepo.findOneById.mockResolvedValueOnce(Some(table1)).mockResolvedValueOnce(Some(table2))
    await handler.execute(command)
    const base = spy.mock.results[0].value
    expect(repo.insert).toHaveBeenCalledWith(base)
    expect(tableRepo.findOneById).toHaveBeenLastCalledWith('tbl2')
    const spec = tbl2Spy.mock.results[0].value
    expect(tableRepo.updateOneById).toHaveBeenCalledOnce()
    expect(tableRepo.updateOneById).toHaveBeenCalledWith(table2.id.value, spec.unwrap())
  })
})
