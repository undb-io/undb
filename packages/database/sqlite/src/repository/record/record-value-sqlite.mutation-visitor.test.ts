import { EntityManager } from '@mikro-orm/better-sqlite'
import {
  ClsStore,
  createTestTable,
  DateRangeFieldValue,
  IClsService,
  ReferenceFieldValue,
  Table,
  TreeFieldValue,
  WithTableSchema,
} from '@undb/core'
import { addDays } from 'date-fns'
import { identity } from 'lodash-es'
import { mock, mockDeep } from 'vitest-mock-extended'
import { RecordValueSqliteMutationVisitor } from './record-value-sqlite.mutation-visitor.js'

describe('RecordValueSqliteVisitor', () => {
  let visitor: RecordValueSqliteMutationVisitor
  let em: EntityManager
  let table: Table
  let cls: IClsService
  let ctx: ClsStore

  beforeAll(() => {
    // @ts-expect-error
    em = global.em as EntityManager
    vi.setSystemTime(new Date(2022, 2, 2))

    cls = mock<IClsService>()
    ctx = mockDeep<ClsStore>({ t: identity })
  })

  describe('dateRange', () => {
    beforeAll(() => {
      table = createTestTable(WithTableSchema.from([{ id: 'fld1', name: 'range', type: 'date-range' }], ctx))

      visitor = new RecordValueSqliteMutationVisitor(
        cls,
        table.id.value,
        table.schema.fieldsIds[1],
        'recordtest',
        true,
        table.schema.toIdMap(),
        em,
      )
    })

    test('should insert into data', () => {
      visitor.dateRange(new DateRangeFieldValue([new Date(), addDays(new Date(), 1)]))

      expect(visitor.data).toMatchInlineSnapshot(`
        {
          "fld1_from": "2022-03-02T00:00:00.000Z",
          "fld1_to": "2022-03-03T00:00:00.000Z",
          "updated_by": undefined,
        }
      `)

      expect(visitor.queries).to.be.empty
    })
  })

  describe('refenrence', () => {
    beforeAll(() => {
      table = createTestTable(WithTableSchema.from([{ id: 'fld1', name: 'reference', type: 'reference' }], ctx))

      visitor = new RecordValueSqliteMutationVisitor(
        cls,
        table.id.value,
        table.schema.fieldsIds[0],
        'recordtest',
        true,
        table.schema.toIdMap(),
        em,
      )
    })

    test('should insert into data to adjacency list table', () => {
      visitor.reference(new ReferenceFieldValue(['foreign_record1', 'foreign_record_2']))

      expect(visitor.data).toMatchInlineSnapshot(`
        {
          "updated_by": undefined,
        }
      `)
      expect(visitor.queries).toMatchInlineSnapshot('[]')
    })
  })

  describe('tree', () => {
    beforeAll(() => {
      table = createTestTable(
        WithTableSchema.unsafeFrom([
          { id: 'fld1', name: 'tree', type: 'tree', parentFieldId: 'fld2' },
          { id: 'fld2', name: 'tree', type: 'parent', treeFieldId: 'fld1' },
        ]),
      )

      visitor = new RecordValueSqliteMutationVisitor(
        cls,
        table.id.value,
        table.schema.fieldsIds[0],
        'recordtest',
        true,
        table.schema.toIdMap(),
        em,
      )
    })

    test('should insert into data to closure table table', () => {
      visitor.tree(new TreeFieldValue(['foreign_record1', 'foreign_record_2']))

      expect(visitor.data).not.to.be.null
      expect(visitor.queries).toMatchInlineSnapshot(`
        [
          "delete from \`fld1_tableId_closure_table\` where \`parent_id\` = 'recordtest'",
          "insert into \`fld1_tableId_closure_table\` (\`child_id\`, \`depth\`, \`parent_id\`) values ('recordtest', 0, 'recordtest')",
          "
                    insert into
                     fld1_tableId_closure_table
                      (parent_id,
                        child_id,
                        depth)

                    select
                      p.parent_id,
                      c.child_id,
                      p.depth+c.depth+1
                    from fld1_tableId_closure_table as p, fld1_tableId_closure_table as c
                    where
                    p.child_id='recordtest'
                    and
                    c.parent_id='foreign_record1'
         ",
          "
                    insert into
                     fld1_tableId_closure_table
                      (parent_id,
                        child_id,
                        depth)

                    select
                      p.parent_id,
                      c.child_id,
                      p.depth+c.depth+1
                    from fld1_tableId_closure_table as p, fld1_tableId_closure_table as c
                    where
                    p.child_id='recordtest'
                    and
                    c.parent_id='foreign_record_2'
         ",
        ]
      `)
    })
  })
})
