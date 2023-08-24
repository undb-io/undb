import { ITableRepository, createTestTable } from '@undb/core'
import { Some } from 'oxide.ts'
import { mock } from 'vitest-mock-extended'
import { SetRowHeightCommandHandler } from './set-row-height.command.handler.js'
import { SetRowHeightCommand } from './set-row-height.command.js'

describe('SetRowHeightCommandHandler', () => {
  test('execute success', async () => {
    const table = createTestTable()
    const repo = mock<ITableRepository>()
    repo.findOneById.mockResolvedValue(Some(table))

    const spy = vi.spyOn(table, 'setRowHeight')

    const command = new SetRowHeightCommand({ tableId: table.id.value, rowHeight: 'short' })

    const handler = new SetRowHeightCommandHandler(repo)
    await handler.execute(command)

    expect(repo.findOneById).toHaveBeenCalledWith(table.id.value)

    expect(spy).toHaveBeenCalledWith(command)

    expect(repo.updateOneById).toHaveBeenCalled()
    expect(repo.updateOneById.mock.calls[0][0]).toBe(table.id.value)
  })
})
