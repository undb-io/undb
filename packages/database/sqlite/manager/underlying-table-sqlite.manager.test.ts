import { createTestTable } from '@egodb/core'
import { EntityManager } from '@mikro-orm/better-sqlite'
import { UnderlyingTableSqliteManager } from './underlying-table-sqlite.manager'

describe('UnderlyingTableSqliteManager', () => {
  let em: EntityManager

  beforeAll(() => {
    // @ts-expect-error
    em = global.em
  })

  test('should create table', async () => {
    const manager = new UnderlyingTableSqliteManager(em)

    const data = await manager.create(createTestTable())

    expect(data).to.be.undefined
  })
})
