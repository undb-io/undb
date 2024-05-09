import { or } from '@undb/domain'
import { TableIdSpecification, TableIdVo, TableNameSpecification, TableNameVo } from '@undb/table'
import Database from 'bun:sqlite'
import { beforeEach, describe, expect, test } from 'bun:test'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { tables } from '../tables'
import { TableFilterVisitor } from './table.filter-visitor'

export const sqlite = new Database(':memory:')
const db = drizzle(sqlite)

describe('TableQueryVisitor', () => {
  let visitor: TableFilterVisitor

  beforeEach(() => {
    visitor = new TableFilterVisitor()
  })

  test.each([
    new TableIdSpecification(new TableIdVo('1')),
    new TableNameSpecification(new TableNameVo('table')),
    or(new TableIdSpecification(new TableIdVo('1')), new TableNameSpecification(new TableNameVo('table'))).unwrap(),
    new TableIdSpecification(new TableIdVo('1')).not(),
    or(
      new TableIdSpecification(new TableIdVo('1')).not(),
      new TableNameSpecification(new TableNameVo('table'))
    ).unwrap(),
  ])('should get correct query', (spec) => {
    spec.accept(visitor)

    const sql = db.select().from(tables).where(visitor.cond).toSQL()
    expect(sql).toMatchSnapshot()
  })
})
