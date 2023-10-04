import {
  Base,
  BaseId,
  BaseRepository,
  ITableRepository,
  Table,
  WithTableBaseId,
  WithTableId,
  createTestTable,
} from '@undb/core'
import { MockProxy, mock } from 'vitest-mock-extended'
import { DeleteBaseCommand } from './delete-base.command'
import { DeleteBaseCommandHandler } from './delete-base.command.handler'
import { Some } from 'oxide.ts'
import { SpyInstance } from 'vitest'

describe('delete base command handler test', () => {
  let repo: MockProxy<BaseRepository>
  let tableRepo: MockProxy<ITableRepository>
  let command: DeleteBaseCommand
  let handler: DeleteBaseCommandHandler
  let base: Base
  let tables: Table[]
  let spy1: SpyInstance
  let spy2: SpyInstance
  const table1 = createTestTable(WithTableId.fromExistingString('tbl1').unwrap(), WithTableBaseId.fromString('basId1'))
  const table2 = createTestTable(WithTableId.fromExistingString('tbl2').unwrap())

  beforeEach(() => {
    repo = mock<BaseRepository>()
    tableRepo = mock<ITableRepository>()
    base = new Base()
    base.id = BaseId.fromOrCreate('basId1')
    spy1 = vi.spyOn(table1, 'withoutBase')
    spy2 = vi.spyOn(table2, 'withoutBase')
    command = new DeleteBaseCommand({ id: 'basId1' })
    handler = new DeleteBaseCommandHandler(repo, tableRepo)
  })

  test('Successfully deleted the base and updated the table', async () => {
    tables = [table1]
    repo.findOneById.calledWith('basId1').mockResolvedValue(Some(base))
    tableRepo.find.mockResolvedValue(tables)

    await handler.execute(command)

    expect(repo.findOneById).toHaveBeenCalledWith(command.id)
    expect(repo.deleteOneById).toHaveBeenCalledWith(base.id.value)
    await expect(tableRepo.find(new WithTableBaseId(Some(base.id)))).resolves.toEqual([table1])
    expect(tableRepo.updateOneById).toHaveBeenCalledWith('tbl1', spy1.mock.results[0].value.unwrap())
  })

  test('Successfully deleted the base without the need to update the table', async () => {
    tables = [table2]
    repo.findOneById.calledWith('basId1').mockResolvedValue(Some(base))
    tableRepo.find.mockResolvedValue(tables)

    await handler.execute(command)

    expect(repo.findOneById).toHaveBeenCalledWith(command.id)
    expect(repo.deleteOneById).toHaveBeenCalledWith(base.id.value)
    await expect(tableRepo.find(new WithTableBaseId(Some(base.id)))).resolves.toEqual([table2])
    expect(spy2.mock.results[0].value.isNone()).toBe(true)
    expect(tableRepo.updateOneById).not.toHaveBeenCalled()
  })

  test('Successfully deleted the base and updated the table only once', async () => {
    tables = [table1, table2]
    repo.findOneById.calledWith('basId1').mockResolvedValue(Some(base))
    tableRepo.find.mockResolvedValue(tables)

    await handler.execute(command)

    expect(repo.findOneById).toHaveBeenCalledWith(command.id)
    expect(repo.deleteOneById).toHaveBeenCalledWith(base.id.value)
    await expect(tableRepo.find(new WithTableBaseId(Some(base.id)))).resolves.toEqual([table1, table2])
    expect(spy2.mock.results[0].value.isNone()).toBe(true)
    expect(tableRepo.updateOneById).toHaveBeenCalledOnce()
  })
})
