import { StringField } from './string-field.js'

it('should create new text field', () => {
  const field = StringField.create({
    name: 'hello',
  })

  expect(field.unpack()).toMatchObject({
    name: 'hello',
    valueConstrains: {
      required: undefined,
    },
  })

  expect(field.type).toBe('string')
})
