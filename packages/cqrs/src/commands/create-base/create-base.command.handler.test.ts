import {
  Base,
  BaseFactory,
  BaseRepository,
  ClsStore,
  IClsService,
  IRecordRepository,
  ITableRepository,
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
    command = new CreateBaseCommand({ name: 'baseName1', tableIds: ['tbl1', 'tbl2', 'tbl3'] })
    // base = new Base()
    spy = vi.spyOn(BaseFactory, 'new')
    handler = new CreateBaseCommandHandler(cls, repo, tableRepo, recordRepo)
  })

  test('create base success', async () => {
    await handler.execute(command)
    const base = spy.mock.results[0]
    expect(repo.insert).toHaveBeenCalledWith(base.value)
    for (const tableId of ['tbl1', 'tbl2', 'tbl3']) {
      const table = createTestTable()
      table.id = TableId.fromOrCreate(tableId)
      tableRepo.findOneById.calledWith(tableId).mockResolvedValue(Some(table))
      const spec = table.moveToBase(base.value.id)
      expect(tableRepo.updateOneById).toHaveBeenCalledWith(table.id.value, spec)
    }
  })
})
