import { TableFactory } from './table.factory'
import { ICreateTableInput_internal } from './table.schema'

describe('TableFactory', () => {
  test.each<ICreateTableInput_internal>([
    {
      id: 'table',
      name: 'table',
      schema: [
        {
          id: 'field1',
          type: 'string',
          name: 'field1',
        },
      ],
    },
  ])('should create table', (input) => {
    const table = TableFactory.from(input)
    expect(table).toMatchSnapshot()
  })
})
