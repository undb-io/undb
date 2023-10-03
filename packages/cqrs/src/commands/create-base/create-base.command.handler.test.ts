import {
  Base,
  BaseFactory,
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
import { Some } from 'oxide.ts'

describe('create base command handler test', () => {
  let cls: MockProxy<IClsService<ClsStore>>
  let repo: MockProxy<BaseRepository>
  let tableRepo: MockProxy<ITableRepository>
  let recordRepo: MockProxy<IRecordRepository>
  let command: CreateBaseCommand
  // let base: Base
  let handler: CreateBaseCommandHandler
  let spy: SpyInstance

  beforeEach(() => {
    cls = mock<IClsService<ClsStore>>()
    repo = mock<BaseRepository>()
    tableRepo = mock<ITableRepository>()
    recordRepo = mock<IRecordRepository>()
    command = new CreateBaseCommand({ name: 'baseName1', tableIds: ['tbl1', 'tbl2'] })
    // base = new Base()
    spy = vi.spyOn(BaseFactory, 'new')
    handler = new CreateBaseCommandHandler(cls, repo, tableRepo, recordRepo)
  })

  test('create base success', async () => {
    const base = spy.mock.results[0]
    console.log(222, base)
    const table1 = createTestTable()
    table1.id = TableId.fromOrCreate('tbl1')
    const tbl1Spy = vi.spyOn(table1, 'moveToBase')
    const table2 = createTestTable()
    table2.id = TableId.fromOrCreate('tbl2')
    const tbl2Spy = vi.spyOn(table2, 'moveToBase')
    for (const table of [table1, table2]) {
      tableRepo.findOneById.calledWith(table.id.value).mockResolvedValue(Some(table))
    }
    await handler.execute(command)
    // expect(repo.insert).toHaveBeenCalledWith(base.value)
    // console.log(1111, tbl1Spy.mock.calls[0], tbl1Spy.mock.results[0].value)
    // console.log(1111, tbl2Spy.mock.calls[0])
    for (const table of [table1, table2]) {
      if (table1.id.value === 'tbl1') {
        expect(tableRepo.updateOneById).toHaveBeenCalledWith(table.id.value, tbl1Spy.mock.results[0].value)
      } else {
        expect(tableRepo.updateOneById).toHaveBeenCalledWith(table.id.value, tbl2Spy.mock.results[0].value)
      }
    }
  })
})
