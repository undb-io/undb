import { TableFactory } from './table.factory'
import { ICreateTableInput_internal } from './table.schema'

describe('TableFactory', () => {
  test.each<ICreateTableInput_internal>([
    {
      id: 'table',
      name: 'table',
      schema: [
        {
          id: 'id',
          key: 'field1',
          type: 'string',
          name: 'field1',
        },
      ],
    },
  ])('should create table', (input) => {
    const table = TableFactory.from(input)
    expect(table.isOk()).to.be.true
    expect(table.unwrap().schema.fields).to.have.length(1)
    expect(table.unwrap().schema.fields.at(0)!.type).not.to.be.undefined
    expect(table.unwrap().schema.fields.at(0)!.type).to.be.eq('string')
  })
})
