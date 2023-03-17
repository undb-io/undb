import { createTestTable, ParentField, ReferenceField, Table, TreeField, WithTableId } from '@egodb/core'
import { Knex } from '@mikro-orm/better-sqlite'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'

describe('RecordSqliteReferenceQueryVisitor', () => {
  let visitor: RecordSqliteReferenceQueryVisitor

  let qb: Knex.QueryBuilder

  let table: Table

  beforeAll(() => {
    table = createTestTable(WithTableId.fromExistingString('tableTest').unwrap())
  })

  beforeEach(() => {
    // @ts-ignore
    const knex: Knex = global.knex

    qb = knex.queryBuilder()

    visitor = new RecordSqliteReferenceQueryVisitor(table, 1, qb, knex)
  })

  test('refenrence', () => {
    visitor.reference(
      ReferenceField.unsafeCreate({ id: 'field1', displayFieldIds: ['field2'], type: 'reference', name: 'reference' }),
    )

    expect(qb.toQuery()).toMatchInlineSnapshot(
      '"select * left join `field1_tabletest_adjacency_list` as `at1` on `t`.`id` = `at1`.`from_id` left join `tabletest` as `ft1` on `ft1`.`id` = `at1`.`to_id` group by `t`.`id`"',
    )
  })

  test('tree', () => {
    visitor.tree(TreeField.unsafeCreate({ id: 'field1', displayFieldIds: ['field2'], type: 'tree', name: 'tree' }))

    expect(qb.toQuery()).toMatchInlineSnapshot(
      '"select * left join `field1_tabletest_closure_table` as `ct1` on `t`.`id` = `ct1`.`parent_id` and `ct1`.`depth` = 1 left join `tabletest` as `ft1` on `ft1`.`id` = `ct1`.`child_id` group by `t`.`id`"',
    )
  })

  test('parent', () => {
    visitor.parent(
      ParentField.unsafeCreate({
        id: 'field1',
        displayFieldIds: ['field2'],
        type: 'parent',
        name: 'parent',
        treeFieldId: 'treefieldid1',
      }),
    )

    expect(qb.toQuery()).toMatchInlineSnapshot(
      '"select * left join `treefieldid1_tabletest_closure_table` as `ct1` on `t`.`id` = `ct1`.`child_id` and `ct1`.`depth` = 1 left join `tabletest` as `ft1` on `ft1`.`id` = `ct1`.`parent_id` group by `t`.`id`"',
    )
  })
})
