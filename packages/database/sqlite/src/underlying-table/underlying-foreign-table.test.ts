import { Knex } from '@mikro-orm/better-sqlite'
import { ReferenceField, TreeField } from '@undb/core'
import { AdjacencyListTable, ClosureTable } from './underlying-foreign-table.js'

describe('UnderlyingAdjacencyListTable', () => {
  let knex: Knex

  beforeAll(() => {
    // @ts-expect-error
    knex = global.knex
  })

  test('should create UnderlyingAdjacencyListTable', () => {
    const table = AdjacencyListTable.fromField('tablename', ReferenceField.create({ id: 'fldid', name: 'reference' }))

    expect(table.name).toMatchInlineSnapshot('"fldid_tablename_adjacency_list"')
    const query = table.getCreateTableSqls(knex)
    expect(query).toMatchInlineSnapshot(
      `
      [
        "create table if not exists \`fldid_tablename_adjacency_list\` (\`to_id\` varchar(255) not null, \`from_id\` varchar(255) not null, foreign key(\`to_id\`) references \`tablename\`(\`id\`), foreign key(\`from_id\`) references \`tablename\`(\`id\`), primary key (\`to_id\`, \`from_id\`))",
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
