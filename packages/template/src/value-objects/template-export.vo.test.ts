import { TemplateExport } from './template-export.vo'

describe('test toTables', () => {
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

    const tables = exports.toTables('usr1')

    expect(tables).toHaveLength(1)
    expect(tables[0].table.schema.fields).toHaveLength(1)
  })
})
