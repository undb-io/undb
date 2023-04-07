import { SafeParseError } from 'zod'
import { SelectField } from './select-field.js'
import { createSelectFieldSchema, ICreateSelectFieldSchema } from './select-field.type.js'

describe('SelectField', () => {
  describe('#create()', () => {
    test('should create new select field', () => {
      const selectField = SelectField.create({
        name: 'select',
        options: [{ name: 'option1' }],
      })

      expect(selectField).toBeInstanceOf(SelectField)
      expect(selectField.type).toBe('select')
      expect(selectField).toHaveProperty('options')
      expect(selectField.options.options).toHaveLength(1)
    })
  })

  describe('createSelectFieldSchema', () => {
    test('should return false if no options', () => {
      const { success, error } = createSelectFieldSchema.safeParse({
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

  describe('createSelectValue', () => {
    test('should create null value', () => {
      const selectField = SelectField.create({
        name: 'select',
        options: [{ name: '1' }],
      })

      const value = selectField.createValue(null)
      expect(value).toMatchInlineSnapshot(`
        SelectFieldValue {
          "props": {
            "value": null,
          },
        }
      `)
    })

    test('should create option value', () => {
      const selectField = SelectField.create({
        name: 'select',
        options: [{ key: 'fld1', name: '1' }],
      })

      const value = selectField.createValue('fld1')
      expect(value).toMatchInlineSnapshot(`
        SelectFieldValue {
          "props": {
            "value": "fld1",
          },
        }
      `)
    })
  })
})
