import { SelectField } from './select-field'

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
})
