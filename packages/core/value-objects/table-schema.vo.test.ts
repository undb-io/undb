import { TableSchema } from './table-schema.vo'

describe('TableSchema', () => {
  describe('createField', () => {
    test('should not has duplicated names', () => {
      const schema = new TableSchema([])
      const [field] = schema.createField({ type: 'string', name: 'string', id: 'string' })
      schema.addField(field)
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
