import { createTestTable, IUnderlyingTableManager, Table as CoreTable, WithTableName } from '@egodb/core'
import { EntityManager } from '@mikro-orm/better-sqlite'
import { mock, MockProxy } from 'vitest-mock-extended'
import { FILTER_SOFT_DELETE } from '../../decorators/soft-delete.decorator.js'
import { Table } from '../../entity/index.js'
import { TableSqliteRepository } from './table-sqlite.repository.js'

describe('TableSqliteRepository', () => {
  let em: EntityManager
  let repo: TableSqliteRepository
  let tm: MockProxy<IUnderlyingTableManager>

  let table: CoreTable

  beforeAll(() => {
    // @ts-expect-error
    em = global.em
    tm = mock<IUnderlyingTableManager>()
  })

  beforeEach(async () => {
    table = createTestTable()

    em = em.fork()
    repo = new TableSqliteRepository(em, tm)
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
    expect(tm.create).toHaveBeenCalledWith(table)
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
    expect(tm.update).toHaveBeenCalledWith(table.id.value, spec)
  })

  test('deleteOneById', async () => {
    await repo.insert(table)
    await repo.deleteOneById(table.id.value)

    const found = await em.findOne(Table, { id: table.id.value })
    expect(found).to.be.null

    const deleted = await em.findOne(Table, { id: table.id.value }, { filters: { [FILTER_SOFT_DELETE]: false } })
    expect(deleted).not.to.be.null

    expect(tm.delete).toHaveBeenCalledWith(table.id.value)
  })
})
