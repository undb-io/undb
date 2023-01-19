import { ReferenceField, TreeField } from '@egodb/core'
import { Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingAdjacencyListTable, UnderlyingClosureTable } from './underlying-foreign-table'

describe('UnderlyingAdjacencyListTable', () => {
  let knex: Knex

  beforeAll(() => {
    // @ts-expect-error
    knex = global.knex
  })

  test('should create UnderlyingAdjacencyListTable', () => {
    const table = new UnderlyingAdjacencyListTable(
      'tablename',
      ReferenceField.create({ id: 'fldid', name: 'reference', type: 'reference', key: 'reference' }),
    )

    expect(table.name).toMatchInlineSnapshot('"fldid_tablename"')
    const query = table.getCreateTableQuery(knex)
    expect(query).toMatchInlineSnapshot()
  })

  test('should create UnderlyingAdjacencyListTable', () => {
    const table = new UnderlyingClosureTable(
      'tablename',
      TreeField.create({ id: 'fldid', name: 'tree', type: 'tree', key: 'tree' }),
    )

    expect(table.name).toMatchInlineSnapshot()
    const query = table.getCreateTableQuery(knex)
    expect(query).toMatchInlineSnapshot()
  })
})
