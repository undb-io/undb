import { EntityManager } from '@mikro-orm/better-sqlite'
import { Table as CoreTable, WithTableName, createTestTable, type ITableCache } from '@undb/core'
import { mock } from 'vitest-mock-extended'
import { FILTER_SOFT_DELETE } from '../../decorators/soft-delete.decorator.js'
import { Table } from '../../entity/index.js'
import { SqliteUnitOfWork } from '../../sqlite.uow.js'
import { TableSqliteRepository } from './table-sqlite.repository.js'

describe('TableSqliteRepository', () => {
  let em: EntityManager
  let repo: TableSqliteRepository

  let table: CoreTable

  beforeAll(() => {
    // @ts-expect-error
    em = global.em
  })

  beforeEach(async () => {
    table = createTestTable()

    em = em.fork()
    const cache = mock<ITableCache>()
    const uow = new SqliteUnitOfWork(em)
    repo = new TableSqliteRepository(uow, cache)
  })

  afterEach(async () => {
    await em.nativeDelete(Table, {})
  })

  test('insert', async () => {
    await repo.insert(table)

    const found = await em.findOne(Table, { id: table.id.value })
    expect(found).not.to.be.null

    expect(found!.id).to.eq(table.id.value)
    expect(found!.name).to.eq(table.name.value)
  })

  test('findOneById', async () => {
    await repo.insert(table)

    const found = await repo.findOneById(table.id.value)

    expect(found.isSome()).to.be.true
    expect(found.unwrap().id.value).to.be.eq(table.id.value)
  })

  test('updateOneById', async () => {
    await repo.insert(table)
    const spec = WithTableName.fromString('newname')
    await repo.updateOneById(table.id.value, spec)

    const found = await em.findOne(Table, { id: table.id.value })
    expect(found).not.to.be.null
    expect(found!.name).not.to.eq(table.name.value)
    expect(found!.name).to.eq('newname')
  })

  test('deleteOneById', async () => {
    await repo.insert(table)
    await repo.deleteOneById(table.id.value)

    const found = await em.findOne(Table, { id: table.id.value })
    expect(found).to.be.null

    const deleted = await em.findOne(Table, { id: table.id.value }, { filters: { [FILTER_SOFT_DELETE]: false } })
    expect(deleted).not.to.be.null
  })
})
