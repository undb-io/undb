import { TableSchema } from './table-schema.vo'

describe('TableSchema', () => {
  describe('createField', () => {
    test('should not has duplicated names', () => {
      const schema = new TableSchema([])
      const spec = schema.createField({ type: 'string', name: 'string', key: 'string' })
      schema.addField(spec.field)
      expect(() => {
        schema.createField({ type: 'string', name: 'string', key: 'string' })
      }).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            \\"code\\": \\"custom\\",
            \\"message\\": \\"field name should not be duplicated\\",
            \\"path\\": [
              \\"field\\",
              \\"name\\"
            ]
          }
        ]"
      `)
    })
  })
})
