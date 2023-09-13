import { ClsStore } from '@undb/core'
import { identity } from 'lodash-es'
import { mockDeep } from 'vitest-mock-extended'
import { TemplateExport } from './template-export.vo'

describe('test toTables', () => {
  let ctx: ClsStore

  beforeEach(() => {
    ctx = mockDeep<ClsStore>({ t: identity })
  })

  test('should create table from template exports', () => {
    const exports = new TemplateExport({
      tables: [
        {
          id: 'tbl1',
          name: 'table',
          schema: [
            {
              id: 'fld1',
              name: 'field1',
              type: 'string',
            },
          ],
        },
      ],
    })

    const tables = exports.toTables(ctx)

    expect(tables).toHaveLength(1)
    expect(tables[0].schema.fields).toHaveLength(6)
  })
})
