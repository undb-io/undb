import { SafeParseError } from 'zod'
import { SelectField } from './select-field'
import { createSelectFieldSchema, ICreateSelectFieldSchema } from './select-field.type'

describe('SelectField', () => {
  describe('#create()', () => {
    test('should create new select field', () => {
      const selectField = SelectField.create({
        type: 'select',
        name: 'select',
        id: 'select',
        options: [{ name: 'option1' }],
      })

      expect(selectField).toBeInstanceOf(SelectField)
      expect(selectField.id.value).toBe('select')
      expect(selectField.type).toBe('select')
      expect(selectField.name.value).toBe('select')
      expect(selectField).toHaveProperty('options')
      expect(selectField.options.options).toHaveLength(1)
    })
  })

  describe('createSelectFieldSchema', () => {
    test('should return false if no options', () => {
      const { success, error } = createSelectFieldSchema.safeParse({
        id: '1',
        name: 'name',
        type: 'select',
        options: [],
      }) as SafeParseError<ICreateSelectFieldSchema>

      expect(success).toBe(false)
      expect(error).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "too_small",
            "minimum": 1,
            "type": "array",
            "inclusive": true,
            "exact": false,
            "message": "Array must contain at least 1 element(s)",
            "path": [
              "options"
            ]
          }
        ]]
      `)
    })
  })
})
