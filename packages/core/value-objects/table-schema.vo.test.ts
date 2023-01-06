import { TableSchema } from './table-schema.vo'

describe('TableSchema', () => {
  describe('createField', () => {
    test('should not has duplicated names', () => {
      const schema = new TableSchema([])
      const spec = schema.createField({ type: 'string', name: 'string', id: 'string' })
      schema.addField(spec.field)
      expect(() => {
        schema.createField({ type: 'string', name: 'string', id: 'string' })
      }).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            \\"code\\": \\"custom\\",
            \\"message\\": \\"Invalid input\\",
            \\"path\\": []
          }
        ]"
      `)
    })
  })
})
