import { ParentField, TreeField } from '@egodb/core'
import { Knex } from '@mikro-orm/better-sqlite'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'

describe('RecordSqliteReferenceQueryVisitor', () => {
  let visitor: RecordSqliteReferenceQueryVisitor

  let qb: Knex.QueryBuilder

  beforeEach(() => {
    // @ts-ignore
    const knex: Knex = global.knex

    qb = knex.queryBuilder()

    visitor = new RecordSqliteReferenceQueryVisitor('tabletest', 't', 1, qb, knex)
  })

  test('tree', () => {
    visitor.tree(TreeField.unsafeCreate({ id: 'field1', displayFieldIds: ['field2'], type: 'tree', name: 'tree' }))

    expect(qb.toQuery()).toMatchInlineSnapshot(
      "\"select json_object('field1',json_object('field2',json_group_array(ft1.field2))) as field1_expand left join `field1_tabletest_closure_table` as `rt1` on `t`.`id` = `rt1`.`parent_id` and `rt1`.`depth` = 1 left join `tabletest` as `ft1` on `ft1`.`id` = `rt1`.`child_id` group by `t`.`id`\"",
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
      "\"select json_object('field1',json_object('field2',ft1.field2)) as field1_expand left join `treefieldid1_tabletest_closure_table` as `rt1` on `t`.`id` = `rt1`.`child_id` and `rt1`.`depth` = 1 left join `tabletest` as `ft1` on `ft1`.`id` = `rt1`.`parent_id` group by `t`.`id`\"",
    )
  })
})
