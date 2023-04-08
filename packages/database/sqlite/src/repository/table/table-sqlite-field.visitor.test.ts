import { EntityManager } from '@mikro-orm/better-sqlite'
import { createTestTable, TreeField } from '@undb/core'
import { Table } from '../../entity/index.js'
import { TableSqliteFieldVisitor } from './table-sqlite-field.visitor.js'

describe('TableSqliteFieldVisitor', () => {
  let em: EntityManager
  let visitor: TableSqliteFieldVisitor

  beforeAll(() => {
    // @ts-expect-error
    em = global.em.fork()

    visitor = new TableSqliteFieldVisitor(new Table(createTestTable()), em)
  })

  test('tree', () => {
    const treeField = TreeField.create({
      id: 'fieldid',
      name: 'tree',
    })

    visitor.tree(treeField)

    // 1. should create closure table
    // 2. should insert initial root relations to closure table
    expect(visitor.queries).toMatchInlineSnapshot(`
      [
        "create table if not exists \`fieldid_tableId_closure_table\` (\`child_id\` varchar(255) not null, \`parent_id\` varchar(255) not null, \`depth\` integer not null default '0', foreign key(\`child_id\`) references \`tableId\`(\`id\`) on delete CASCADE, foreign key(\`parent_id\`) references \`tableId\`(\`id\`) on delete CASCADE, primary key (\`child_id\`, \`parent_id\`))",
        "
             create index if not exists \`fieldid_tableId_closure_table_depth_index\` on \`fieldid_tableId_closure_table\` (\`depth\`)
             ",
        "insert into \`fieldid_tableId_closure_table\` select \`id\` as \`child_id\`, \`id\` as \`parent_id\`, 0 as \`depth\` from \`tableId\`",
      ]
    `)
  })
})
