import { BoolField } from './bool-field'
import { DateField } from './date-field'
import { DateRangeField } from './date-range-field'
import { FieldFactory } from './field.factory'
import { Field } from './field.type'
import { NumberField } from './number-field'
import { SelectField } from './select-field'
import { StringField } from './string-field'
import { FieldKey } from './value-objects'

it('should create string field', () => {
  const field = FieldFactory.create({
    type: 'string',
    name: 'hello',
    key: 'abc',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(StringField)
  expect(field.type).toBe('string')
  expect(field.key).toBeInstanceOf(FieldKey)
  expect(field.key.value).toBe('abc')
})

it('should create number field', () => {
  const field = FieldFactory.create({
    type: 'number',
    name: 'hello',
    key: 'abc',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(NumberField)
  expect(field.type).toBe('number')
  expect(field.key).toBeInstanceOf(FieldKey)
  expect(field.key.value).toBe('abc')
})

it('should create date field', () => {
  const field = FieldFactory.create({
    type: 'date',
    name: 'hello',
    key: 'date',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(DateField)
  expect(field.type).toBe('date')
  expect(field.key).toBeInstanceOf(FieldKey)
  expect(field.key.value).toBe('date')
})

it('should create date range field', () => {
  const field = FieldFactory.create({
    type: 'date-range',
    name: 'hello',
    key: 'date-range',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(DateRangeField)
  expect(field.type).toBe('date-range')
  expect(field.key).toBeInstanceOf(FieldKey)
  expect(field.key.value).toBe('date-range')
})

it('should create select field', () => {
  const field = FieldFactory.create({
    type: 'select',
    name: 'hello',
    key: 'abc',
    options: [],
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(SelectField)
  expect(field.type).toBe('select')
  expect(field.key).toBeInstanceOf(FieldKey)
  expect(field.key.value).toBe('abc')
})

it('should create bool field', () => {
  const field = FieldFactory.create({
    type: 'bool',
    name: 'hello',
    key: 'abc',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(BoolField)
  expect(field.type).toBe('bool')
})
