import { createTestTable, DateRangeFieldValue, ReferenceFieldValue, Table, WithTableSchema } from '@egodb/core'
import { EntityManager } from '@mikro-orm/better-sqlite'
import { addDays } from 'date-fns'
import { RecordValueSqliteVisitor } from './record-value-sqlite.visitor'

describe('RecordValueSqliteVisitor', () => {
  let visitor: RecordValueSqliteVisitor
  let em: EntityManager
  let table: Table

  beforeAll(() => {
    // @ts-expect-error
    em = global.em as EntityManager
    vi.setSystemTime(new Date(2022, 2, 2))
  })

  describe('dateRange', () => {
    beforeAll(() => {
      table = createTestTable(WithTableSchema.from([{ id: 'fld1', name: 'range', key: 'range', type: 'date-range' }]))

      visitor = new RecordValueSqliteVisitor(
        table.id.value,
        table.schema.fieldsIds[0],
        'recordtest',
        table.schema.toIdMap(),
        em,
      )
    })

    test('should insert into data', () => {
      visitor.dateRange(new DateRangeFieldValue([new Date(), addDays(new Date(), 1)]))

      expect(visitor.data).toMatchInlineSnapshot(`
        {
          "fld1_from": 2022-03-02T00:00:00.000Z,
          "fld1_to": 2022-03-03T00:00:00.000Z,
        }
      `)

      expect(visitor.queries).to.be.empty
    })
  })

  describe('refenrence', () => {
    beforeAll(() => {
      table = createTestTable(
        WithTableSchema.from([{ id: 'fld1', name: 'reference', key: 'reference', type: 'reference' }]),
      )

      visitor = new RecordValueSqliteVisitor(
        table.id.value,
        table.schema.fieldsIds[0],
        'recordtest',
        table.schema.toIdMap(),
        em,
      )
    })

    test('should insert into data to m2m table', () => {
      visitor.reference(new ReferenceFieldValue(['foreign_record1', 'foreign_record_2']))

      expect(visitor.data).toMatchInlineSnapshot(`
      {
        "fld1": "[\\"foreign_record1\\",\\"foreign_record_2\\"]",
      }
    `)
      expect(visitor.queries).toMatchInlineSnapshot(`
      [
        "delete from \`fld1_tableId\` where \`parent_id\` = 'recordtest'",
        "insert into \`fld1_tableId\` (\`child_id\`, \`parent_id\`) values ('foreign_record1', 'recordtest') on conflict do nothing",
        "insert into \`fld1_tableId\` (\`child_id\`, \`parent_id\`) values ('foreign_record_2', 'recordtest') on conflict do nothing",
      ]
    `)
    })
  })
})
