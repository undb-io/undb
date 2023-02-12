import { TableSchema } from './table-schema.vo.js'

describe('TableSchema', () => {
  describe('createField', () => {
    test('should not has duplicated names', () => {
      const schema = new TableSchema([])
      const spec = schema.createField({ type: 'string', name: 'string' })
      schema.addField(spec[0].field)
      expect(() => {
        schema.createField({ type: 'string', name: 'string' })
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
