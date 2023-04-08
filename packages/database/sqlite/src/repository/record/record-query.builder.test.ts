import { EntityManager } from '@mikro-orm/better-sqlite'
import {
  createTestSelectField,
  createTestStringField,
  createTestTable,
  createTestView,
  TableSchema,
  Views,
  WithTableSchema,
  WithTableViews,
} from '@undb/core'
import { RecordSqliteQueryBuilder } from './record-query.builder'

const directions = ['asc', 'desc'] as const

describe('RecordSqliteQueryBuilder', () => {
  let queryBuilder: RecordSqliteQueryBuilder

  let em: EntityManager

  beforeAll(() => {
    // @ts-expect-error
    em = global.em
  })

  describe('sort', () => {
    describe('sort string field', () => {
      it.each(directions)('should order by string option %s', (direction) => {
        const table = createTestTable(
          new WithTableSchema(new TableSchema([createTestStringField({ id: 'fld1' })])),
          new WithTableViews(new Views([createTestView({ sorts: [{ fieldId: 'fld1', direction }] })])),
        )

        queryBuilder = new RecordSqliteQueryBuilder(em, table, null)
        queryBuilder.sort()

        const query = queryBuilder.qb.toQuery()

        expect(query).toMatchSnapshot()
      })
    })

    describe('sort select', () => {
      it.each(directions)('should order by select option %s', (direction) => {
        const table = createTestTable(
          new WithTableSchema(new TableSchema([createTestSelectField({ id: 'fld1' })])),
          new WithTableViews(new Views([createTestView({ sorts: [{ fieldId: 'fld1', direction }] })])),
        )

        queryBuilder = new RecordSqliteQueryBuilder(em, table, null)
        queryBuilder.sort()

        const query = queryBuilder.qb.toQuery()

        expect(query).toMatchSnapshot()
      })
    })
  })
})
