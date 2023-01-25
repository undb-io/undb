import {
  createTestTable,
  DateRangeFieldValue,
  ReferenceFieldValue,
  Table,
  TreeFieldValue,
  WithTableSchema,
} from '@egodb/core'
import { EntityManager } from '@mikro-orm/better-sqlite'
import { addDays } from 'date-fns'
import { RecordValueSqliteMutationVisitor } from './record-value-sqlite.mutation-visitor'

describe('RecordValueSqliteVisitor', () => {
  let visitor: RecordValueSqliteMutationVisitor
  let em: EntityManager
  let table: Table

  beforeAll(() => {
    // @ts-expect-error
    em = global.em as EntityManager
    vi.setSystemTime(new Date(2022, 2, 2))
  })

  describe('dateRange', () => {
    beforeAll(() => {
      table = createTestTable(WithTableSchema.from([{ id: 'fld1', name: 'range', type: 'date-range' }]))

      visitor = new RecordValueSqliteMutationVisitor(
        table.id.value,
        table.schema.fieldsIds[1],
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
      table = createTestTable(WithTableSchema.from([{ id: 'fld1', name: 'reference', type: 'reference' }]))

      visitor = new RecordValueSqliteMutationVisitor(
        table.id.value,
        table.schema.fieldsIds[0],
        'recordtest',
        table.schema.toIdMap(),
        em,
      )
    })

    test('should insert into data to adjacency list table', () => {
      visitor.reference(new ReferenceFieldValue(['foreign_record1', 'foreign_record_2']))

      expect(visitor.data).toMatchInlineSnapshot('{}')
      expect(visitor.queries).toMatchInlineSnapshot('[]')
    })
  })

  describe('tree', () => {
    beforeAll(() => {
      table = createTestTable(WithTableSchema.from([{ id: 'fld1', name: 'tree', type: 'tree' }]))

      visitor = new RecordValueSqliteMutationVisitor(
        table.id.value,
        table.schema.fieldsIds[0],
        'recordtest',
        table.schema.toIdMap(),
        em,
      )
    })

    test('should insert into data to closure table table', () => {
      visitor.tree(new TreeFieldValue(['foreign_record1', 'foreign_record_2']))

      expect(visitor.data).toMatchInlineSnapshot('{}')
      expect(visitor.queries).toMatchInlineSnapshot('[]')
    })
  })
})
