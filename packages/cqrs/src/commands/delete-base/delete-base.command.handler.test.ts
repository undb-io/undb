import {
  Base,
  BaseId,
  BaseRepository,
  ITableRepository,
  Table,
  TableId,
  WithTableBaseId,
  createTestTable,
} from '@undb/core'
import { MockProxy, mock } from 'vitest-mock-extended'
import { DeleteBaseCommand } from './delete-base.command'
import { DeleteBaseCommandHandler } from './delete-base.command.handler'
import { Option, Some } from 'oxide.ts'

describe('delete base command handler test', () => {
  let repo: MockProxy<BaseRepository>
  let tableRepo: MockProxy<ITableRepository>
  let command: DeleteBaseCommand
  let handler: DeleteBaseCommandHandler
  let base: Base
  let tables: Table[]
  const table1 = createTestTable()
  table1.id = TableId.fromOrCreate('tbl1')
  const table2 = createTestTable()
  table2.id = TableId.fromOrCreate('tbl2')

  beforeEach(() => {
    repo = mock<BaseRepository>()
    tableRepo = mock<ITableRepository>()
    base = new Base()
    base.id = BaseId.fromOrCreate('basId1')
    command = new DeleteBaseCommand({ id: 'basId1' })
    handler = new DeleteBaseCommandHandler(repo, tableRepo)
  })

  test('Successfully deleted the base and updated the table', async () => {
    tables = [table1]
    table1.baseId = Option(base.id)
    repo.findOneById.calledWith('basId1')
    repo.findOneById.mockResolvedValue(Some(base))
    const spy1 = vi.spyOn(table1, 'withoutBase')
    tableRepo.find.mockResolvedValue(tables)
    await handler.execute(command)
    expect(repo.findOneById).toHaveBeenCalledWith(command.id)
    expect(repo.deleteOneById).toHaveBeenCalledWith(base.id.value)
    await expect(tableRepo.find(new WithTableBaseId(Some(base.id)))).resolves.toEqual([table1])
    expect(tableRepo.updateOneById).toHaveBeenCalledWith('tbl1', spy1.mock.results[0].value.unwrap())
  })

  test('Successfully deleted the base without the need to update the table', async () => {
    tables = [table2]
    repo.findOneById.calledWith('basId1')
    repo.findOneById.mockResolvedValue(Some(base))
    tableRepo.find.mockResolvedValue(tables)
    await handler.execute(command)
    expect(repo.findOneById).toHaveBeenCalledWith(command.id)
    expect(repo.deleteOneById).toHaveBeenCalledWith(base.id.value)
    await expect(tableRepo.find(new WithTableBaseId(Some(base.id)))).resolves.toEqual([table2])
    expect(tableRepo.updateOneById).not.toHaveBeenCalled()
  })
})
