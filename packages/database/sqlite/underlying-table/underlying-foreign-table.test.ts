import { ReferenceField, TreeField } from '@egodb/core'
import { Knex } from '@mikro-orm/better-sqlite'
import { AdjacencyListTable, ClosureTable } from './underlying-foreign-table'

describe('UnderlyingAdjacencyListTable', () => {
  let knex: Knex

  beforeAll(() => {
    // @ts-expect-error
    knex = global.knex
  })

  test('should create UnderlyingAdjacencyListTable', () => {
    const table = new AdjacencyListTable('tablename', ReferenceField.create({ id: 'fldid', name: 'reference' }))

    expect(table.name).toMatchInlineSnapshot('"fldid_tablename_adjacency_list"')
    const query = table.getCreateTableSqls(knex)
    expect(query).toMatchInlineSnapshot(
      `
      [
        "create table \`fldid_tablename_adjacency_list\` (\`child_id\` varchar(255) not null, \`parent_id\` varchar(255) not null, foreign key(\`child_id\`) references \`tablename\`(\`id\`), foreign key(\`parent_id\`) references \`tablename\`(\`id\`), primary key (\`child_id\`, \`parent_id\`))",
      ]
    `,
    )
  })

  test('should create UnderlyingAdjacencyListTable', () => {
    const table = new ClosureTable('tablename', TreeField.create({ id: 'fldid', name: 'tree' }))

    expect(table.name).toMatchInlineSnapshot('"fldid_tablename_closure_table"')
    const query = table.getCreateTableSqls(knex)
    expect(query).toMatchInlineSnapshot(
      `
      [
        "create table if not exists \`fldid_tablename_closure_table\` (\`child_id\` varchar(255) not null, \`parent_id\` varchar(255) not null, \`depth\` integer not null default '0', foreign key(\`child_id\`) references \`tablename\`(\`id\`) on delete CASCADE, foreign key(\`parent_id\`) references \`tablename\`(\`id\`) on delete CASCADE, primary key (\`child_id\`, \`parent_id\`))",
        "
             create index if not exists \`fldid_tablename_closure_table_depth_index\` on \`fldid_tablename_closure_table\` (\`depth\`)
             ",
      ]
    `,
    )
  })
})
