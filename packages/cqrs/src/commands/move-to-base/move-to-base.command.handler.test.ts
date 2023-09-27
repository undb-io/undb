import { Base, BaseRepository, ITableRepository, Table, createTestTable } from '@undb/core'
import { MockProxy, mock } from 'vitest-mock-extended'
import { MoveToBaseCommand } from './move-to-base.command'
import { MoveToBaseCommandHandler } from './move-to-base.command.handler'
import { None, Some } from 'oxide.ts'
import { CreateBaseCommand, CreateBaseCommandHandler } from '../create-base'
import { SpyInstance } from 'vitest'

describe('test move to base', () => {
  let repo: MockProxy<ITableRepository>
  let baseRepo: MockProxy<BaseRepository>
  let command: MockProxy<MoveToBaseCommand>
  let handler: MoveToBaseCommandHandler
  const table = createTestTable()
  let base: Base
  let spy: SpyInstance

  beforeEach(() => {
    repo = mock<ITableRepository>()
    baseRepo = mock<BaseRepository>()
    command = new MoveToBaseCommand({ tableId: 'tbl1', baseId: 'base1' })
    handler = new MoveToBaseCommandHandler(repo, baseRepo)
    base = new Base()
    spy = vi.spyOn(table, 'moveToBase')
  })

  test('move to base success', async () => {
    repo.findOneById.mockResolvedValue(Some(table))
    baseRepo.findOneById.mockResolvedValue(Some(base))
    await handler.execute(command)
    expect(spy).toHaveBeenCalledWith(base.id)
    expect(repo.updateOneById).toHaveBeenCalled()
  })

  test('move to base failed', async () => {
    repo.findOneById.mockResolvedValue(Some(table))
    baseRepo.findOneById.mockResolvedValue(Some(base))
    spy.mockReturnValue(None)
    await handler.execute(command)
    expect(spy).toHaveBeenCalledWith(base.id)
    expect(repo.updateOneById).not.toHaveBeenCalled()
  })
})
