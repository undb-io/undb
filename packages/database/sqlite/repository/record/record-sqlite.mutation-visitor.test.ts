import { createTestTable, ReferenceEqual, WithTableId, WithTableSchema } from '@egodb/core'
import { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { RecordSqliteMutationVisitor } from './record-sqlite.mutation-visitor'

describe('RecordSqliteMutationVisitor', () => {
  const tableId = 'tabletest'
  const recordId = 'recordtesti'

  const table = createTestTable(
    WithTableId.fromString(tableId),
    WithTableSchema.from([{ id: 'fld1', type: 'reference', key: 'reference', name: 'reference' }]),
  )

  let em: EntityManager
  let qb: Knex.QueryBuilder

  let mv: RecordSqliteMutationVisitor

  beforeAll(() => {
    // @ts-expect-error
    em = global.em.fork()

    qb = em.getKnex().queryBuilder()

    mv = new RecordSqliteMutationVisitor(tableId, recordId, table.schema.toIdMap(), em, qb)
  })

  test('referenceEqual', async () => {
    mv.referenceEqual(new ReferenceEqual('fld1', ['record2']))
  })
})
