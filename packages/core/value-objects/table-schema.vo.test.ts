import { TableSchema } from './table-schema.vo'

describe('TableSchema', () => {
  describe('createField', () => {
    test('should not has duplicated names', () => {
      const schema = new TableSchema([])
      const [field] = schema.createField({ type: 'text', name: 'text', id: 'text' })
      schema.addField(field)
      expect(() => {
        schema.createField({ type: 'text', name: 'text', id: 'text' })
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
