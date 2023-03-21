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

    visitor = new RecordSqliteReferenceQueryVisitor(table, qb, knex, new Set())
  })

  test('refenrence', () => {
    visitor.reference(
      ReferenceField.unsafeCreate({ id: 'field1', displayFieldIds: ['field2'], type: 'reference', name: 'reference' }),
    )

    expect(qb.toQuery()).toMatchInlineSnapshot(
      '"select json_group_array(uta_field1.to_id) filter (where uta_field1.to_id is not null) as field1 left join `field1_tableTest_adjacency_list` as `uta_field1` on `t`.`id` = `uta_field1`.`from_id` left join `tableTest` as `ft_field1` on `ft_field1`.`id` = `uta_field1`.`to_id` group by `t`.`id`"',
    )
  })

  test('tree', () => {
    visitor.tree(TreeField.unsafeCreate({ id: 'field1', displayFieldIds: ['field2'], type: 'tree', name: 'tree' }))

    expect(qb.toQuery()).toMatchInlineSnapshot(
      '"select json_group_array(uta_field1.child_id) filter (where uta_field1.child_id is not null) as field1 left join `field1_tableTest_closure_table` as `uta_field1` on `t`.`id` = `uta_field1`.`parent_id` and `uta_field1`.`depth` = 1 left join `tableTest` as `ft_field1` on `ft_field1`.`id` = `uta_field1`.`child_id` group by `t`.`id`"',
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
      '"select uta_field1.parent_id as field1 left join `treefieldid1_tableTest_closure_table` as `uta_field1` on `t`.`id` = `uta_field1`.`child_id` and `uta_field1`.`depth` = 1 left join `tableTest` as `ft_field1` on `ft_field1`.`id` = `uta_field1`.`parent_id` group by `t`.`id`"',
    )
  })
})
