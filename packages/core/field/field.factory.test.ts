import { FieldFactory } from './field.factory'
import { Field } from './field.type'
import { NumberField } from './number.field'
import { SelectField } from './select.field'
import { StringField } from './string.field'
import { FieldName } from './value-objects'

it('should create string field', () => {
  const field = FieldFactory.create({
    type: 'string',
    name: 'hello',
    id: 'abc',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(StringField)
  expect(field.type).toBe('string')
  expect(field.name).toBeInstanceOf(FieldName)
  expect(field.name.value).toBe('hello')
})

it('should create number field', () => {
  const field = FieldFactory.create({
    type: 'number',
    name: 'hello',
    id: 'abc',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(NumberField)
  expect(field.type).toBe('number')
  expect(field.name).toBeInstanceOf(FieldName)
  expect(field.name.value).toBe('hello')
})

it('should create select field', () => {
  const field = FieldFactory.create({
    type: 'select',
    name: 'hello',
    id: 'abc',
    options: [],
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(SelectField)
  expect(field.type).toBe('select')
  expect(field.name).toBeInstanceOf(FieldName)
  expect(field.name.value).toBe('hello')
})
