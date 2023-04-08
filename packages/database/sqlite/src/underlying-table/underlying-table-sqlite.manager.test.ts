import { EntityManager } from '@mikro-orm/better-sqlite'
import {
  createTestTable,
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
} from '@undb/core'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from './constants.js'
import { UnderlyingTableSqliteManager } from './underlying-table-sqlite.manager.js'

describe('UnderlyingTableSqliteManager', () => {
  let em: EntityManager

  beforeAll(() => {
    // @ts-expect-error
    em = global.em
  })

  test('should create table', async () => {
    const manager = new UnderlyingTableSqliteManager(em)
    const table = createTestTable()
    const data = await manager.create(table)

    expect(data).to.be.undefined

    const knex = em.getKnex()

    const hasTbale = await knex.schema.hasTable(table.id.value)
    expect(hasTbale).to.be.true

    const hasId = await knex.schema.hasColumn(table.id.value, INTERNAL_COLUMN_ID_NAME)
    expect(hasId).to.be.true

    const hasCreatedAt = await knex.schema.hasColumn(table.id.value, INTERNAL_COLUMN_CREATED_AT_NAME)
    expect(hasCreatedAt).to.be.true

    const hasUpdatedAt = await knex.schema.hasColumn(table.id.value, INTERNAL_COLUMN_UPDATED_AT_NAME)
    expect(hasUpdatedAt).to.be.true

    const hasDeletedAt = await knex.schema.hasColumn(table.id.value, INTERNAL_COLUMN_DELETED_AT_NAME)
    expect(hasDeletedAt).to.be.true

    await knex.schema.dropTable(table.id.value)
  })
})
