import { createTestTable, IUnderlyingTableManager, Table as CoreTable } from '@egodb/core'
import { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { mock, MockProxy } from 'vitest-mock-extended'
import { TableSqliteRepository } from './table-sqlite.repository'

describe('TableSqliteRepository', () => {
  let knex: Knex
  let em: EntityManager
  let repo: TableSqliteRepository
  let tm: MockProxy<IUnderlyingTableManager>

  let table: CoreTable

  beforeAll(() => {
    // @ts-expect-error
    knex = global.knex
    // @ts-expect-error
    em = global.em
    tm = mock<IUnderlyingTableManager>()

    repo = new TableSqliteRepository(em, tm)
  })

  beforeEach(async () => {
    table = createTestTable()
    await repo.insert(table)
  })

  test('deleteOneById', async () => {
    await repo.deleteOneById(table.id.value)

    expect(tm.delete).toHaveBeenCalledWith(table.id.value)
  })
})
