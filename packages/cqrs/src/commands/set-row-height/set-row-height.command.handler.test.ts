import { ITableRepository, ITableSpec, createTestTable } from '@undb/core'
import { Some } from 'oxide.ts'
import { SetRowHeightCommandHandler } from './set-row-height.command.handler'

describe('setRowHeight', () => {
  test('set row hight', () => {
    const tableRepository: ITableRepository = {
      findOneById: async () => {
        const result = createTestTable()
        return Some(result)
      },
      findOne: async () => {
        throw new Error('Method not implemented.')
      },
      find: async () => {
        throw new Error('Method not implemented.')
      },
      insert: async () => {},
      updateOneById: async (id: string, spec: ITableSpec) => {},
      deleteOneById: async (id: string) => {},
    }
    const setRowHeightTest = new SetRowHeightCommandHandler(tableRepository)
    // expect(setRowHeightTest.execute()).toMatchSnapshot()
  })
})
