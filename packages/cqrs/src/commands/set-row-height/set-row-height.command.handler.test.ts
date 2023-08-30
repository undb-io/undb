import { ITableRepository, Table, createTestTable } from '@undb/core'
import { None, Some } from 'oxide.ts'
import { MockProxy, mock } from 'vitest-mock-extended'
import { SetRowHeightCommandHandler } from './set-row-height.command.handler.js'
import { SetRowHeightCommand } from './set-row-height.command.js'
import { SpyInstance } from 'vitest'

describe('SetRowHeightCommandHandler', () => {
  let table: Table
  let repo: MockProxy<ITableRepository>
  let spy: SpyInstance
  let command: SetRowHeightCommand
  let handler: SetRowHeightCommandHandler

  beforeEach(() => {
    table = createTestTable()

    repo = mock<ITableRepository>()

    spy = vi.spyOn(table, 'setRowHeight')

    command = new SetRowHeightCommand({ tableId: table.id.value, rowHeight: 'short' })

    handler = new SetRowHeightCommandHandler(repo)
  })

  test('execute success', async () => {
    repo.findOneById.mockResolvedValue(Some(table))

    await handler.execute(command)

    expect(repo.findOneById).toHaveBeenCalledWith(table.id.value)

    expect(spy).toHaveBeenCalledWith(command)

    expect(repo.updateOneById).toHaveBeenCalled()
    expect(repo.updateOneById.mock.calls[0][0]).toBe(table.id.value)
  })

  test('execute failed', async () => {
    repo.findOneById.mockResolvedValue(None)

    await expect(handler.execute(command)).rejects.toThrowErrorMatchingInlineSnapshot(
      '"Failed to unwrap Option (found None)"',
    )
    expect(repo.findOneById).toHaveBeenCalledWith(table.id.value)
    expect(spy).not.toHaveBeenCalled()
    expect(repo.updateOneById).not.toHaveBeenCalled()
  })

  test('findOneById throw error', async () => {
    repo.findOneById.mockRejectedValue(new Error('findOneById failed'))

    await expect(handler.execute(command)).rejects.toThrowErrorMatchingInlineSnapshot('"findOneById failed"')
    expect(spy).not.toHaveBeenCalled()
    expect(repo.updateOneById).not.toHaveBeenCalled()
  })

  test('updateOneById throw error', async () => {
    repo.findOneById.mockResolvedValue(Some(table))
    repo.updateOneById.mockRejectedValue(new Error('updateOneById failed'))

    await expect(handler.execute(command)).rejects.toThrowErrorMatchingInlineSnapshot('"updateOneById failed"')

    expect(repo.findOneById).toHaveBeenCalledWith(table.id.value)
    expect(spy).toHaveBeenCalledWith(command)
  })
})
