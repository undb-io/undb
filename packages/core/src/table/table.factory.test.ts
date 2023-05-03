import { identity } from 'lodash-es'
import { mockDeep } from 'vitest-mock-extended'
import { ClsStore } from '../cls/cls.js'
import { TableFactory } from './table.factory.js'
import { ICreateTableInput_internal } from './table.schema.js'

describe('TableFactory', () => {
  const ctx = mockDeep<ClsStore>({ t: identity })
  test.each<ICreateTableInput_internal>([
    {
      id: 'table',
      name: 'table',
      schema: [
        {
          id: 'fldid',
          type: 'string',
          name: 'field1',
        },
      ],
    },
  ])('should create table', (input) => {
    const table = TableFactory.from(input, ctx)
    expect(table.isOk()).to.be.true
    expect(table.unwrap().schema.fields).to.have.length(6)
    expect(table.unwrap().schema.fields.at(0)!.type).not.to.be.undefined
    expect(table.unwrap().schema.fields.at(0)!.type).to.be.eq('id')
    expect(table.unwrap().schema.fields.at(1)!.type).not.to.be.undefined
    expect(table.unwrap().schema.fields.at(1)!.type).to.be.eq('string')
    expect(table.unwrap().schema.fields.at(2)!.type).not.to.be.undefined
    expect(table.unwrap().schema.fields.at(2)!.type).to.be.eq('created-at')
    expect(table.unwrap().schema.fields.at(3)!.type).to.be.eq('created-by')
    expect(table.unwrap().schema.fields.at(4)!.type).not.to.be.undefined
    expect(table.unwrap().schema.fields.at(4)!.type).to.be.eq('updated-at')
    expect(table.unwrap().schema.fields.at(5)!.type).to.be.eq('updated-by')
  })
})
