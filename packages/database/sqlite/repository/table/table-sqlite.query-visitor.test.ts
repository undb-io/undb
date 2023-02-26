import { WithTableId, WithTableName } from '@egodb/core'
import { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import { Table } from '../../entity/index.js'
import { TableSqliteQueryVisitor } from './table-sqlite.query-visitor.js'

describe('TableSqliteQueryVisitor', () => {
  let em: EntityManager
  let qb: QueryBuilder<Table>
  let qv: TableSqliteQueryVisitor

  beforeEach(() => {
    // @ts-expect-error
    em = global.em.fork()

    qb = em.qb(Table)

    qv = new TableSqliteQueryVisitor(qb)
  })

  test('idEqual', async () => {
    qv.idEqual(WithTableId.fromString('someid'))

    expect(qb.getQuery()).toMatchInlineSnapshot('"select `t0`.* from `ego_table` as `t0` where `t0`.`id` = ?"')
    expect(qb.getParams()).toMatchInlineSnapshot(`
      [
        "someid",
      ]
    `)
  })

  test('nameEqual', async () => {
    qv.nameEqual(WithTableName.fromString('name'))

    expect(qb.getQuery()).toMatchInlineSnapshot('"select `t0`.* from `ego_table` as `t0` where `t0`.`name` = ?"')
    expect(qb.getParams()).toMatchInlineSnapshot(`
      [
        "name",
      ]
    `)
  })
})
