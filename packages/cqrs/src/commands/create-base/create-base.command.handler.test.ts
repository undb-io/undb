import {
  BaseFactory,
  BaseRepository,
  ClsStore,
  IClsService,
  IRecordRepository,
  ITableRepository,
  WithTableBaseId,
  WithTableId,
  createTestTable,
} from '@undb/core'
import { MockProxy, mock } from 'vitest-mock-extended'
import { CreateBaseCommand } from './create-base.command'
import { CreateBaseCommandHandler } from './create-base.command.handler'
import { SpyInstance } from 'vitest'
import { Some } from 'oxide.ts'

describe('create base command handler test', () => {
  let cls: MockProxy<IClsService<ClsStore>>
  let repo: MockProxy<BaseRepository>
  let tableRepo: MockProxy<ITableRepository>
  let recordRepo: MockProxy<IRecordRepository>
  let command: CreateBaseCommand
  let handler: CreateBaseCommandHandler
  let spy: SpyInstance
  const table1 = createTestTable(WithTableId.fromExistingString('tbl1').unwrap(), WithTableBaseId.fromString('basId1'))
  const table2 = createTestTable(WithTableId.fromExistingString('tbl2').unwrap())
  let tbl2Spy: SpyInstance
  let tbl1Spy: SpyInstance

  beforeEach(() => {
    cls = mock<IClsService<ClsStore>>()
    repo = mock<BaseRepository>()
    tableRepo = mock<ITableRepository>()
    recordRepo = mock<IRecordRepository>()
    spy = vi.spyOn(BaseFactory, 'new')
    handler = new CreateBaseCommandHandler(cls, repo, tableRepo, recordRepo)
    tbl2Spy = vi.spyOn(table2, 'moveToBase')
    tbl1Spy = vi.spyOn(table1, 'moveToBase')
  })

  test('Successfully create base and updated the table', async () => {
    command = new CreateBaseCommand({ name: 'baseName1', tableIds: ['tbl2'] })
    tableRepo.findOneById.mockResolvedValue(Some(table2))

    await handler.execute(command)
    const base = spy.mock.results[0].value
    expect(repo.insert).toHaveBeenCalledWith(base)
    const spec = tbl2Spy.mock.results[0].value
    expect(tableRepo.updateOneById).toHaveBeenCalledWith(table2.id.value, spec.unwrap())
  })

  test('Successfully create base without the need to update the table', async () => {
    command = new CreateBaseCommand({ name: 'baseName1', id: 'basId1', tableIds: ['tbl1'] })
    tableRepo.findOneById.mockResolvedValue(Some(table1))

    await handler.execute(command)

    const base = spy.mock.results[0].value
    expect(repo.insert).toHaveBeenCalledWith(base)
    expect(tbl1Spy.mock.results[0].value.isNone()).toBe(true)
    expect(tableRepo.updateOneById).not.toHaveBeenCalled()
  })

  test('Successfully create base and updated the table once time', async () => {
    command = new CreateBaseCommand({ name: 'baseName1', id: 'basId1', tableIds: ['tbl1', 'tbl2'] })
    tableRepo.findOneById.mockResolvedValueOnce(Some(table1)).mockResolvedValueOnce(Some(table2))

    await handler.execute(command)

    const base = spy.mock.results[0].value
    expect(repo.insert).toHaveBeenCalledWith(base)
    expect(tableRepo.findOneById).toHaveBeenCalledTimes(2)
    const spec = tbl2Spy.mock.results[0].value
    expect(tbl1Spy.mock.results[0].value.isNone()).toBe(true)
    expect(tableRepo.updateOneById).toHaveBeenCalledOnce()
    expect(tableRepo.updateOneById).toHaveBeenCalledWith(table2.id.value, spec.unwrap())
  })
})
