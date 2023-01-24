import { BoolField } from './bool-field'
import { DateField } from './date-field'
import { DateRangeField } from './date-range-field'
import { FieldFactory } from './field.factory'
import { Field } from './field.type'
import { NumberField } from './number-field'
import { SelectField } from './select-field'
import { StringField } from './string-field'

it('should create string field', () => {
  const field = FieldFactory.create({
    id: 'fldid',
    type: 'string',
    name: 'hello',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(StringField)
  expect(field.type).toBe('string')
  expect(field.id.value).toBe('fldid')
})

it('should create number field', () => {
  const field = FieldFactory.create({
    id: 'fldid',
    type: 'number',
    name: 'hello',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(NumberField)
  expect(field.type).toBe('number')
  expect(field.id.value).toBe('fldid')
})

it('should create date field', () => {
  const field = FieldFactory.create({
    id: 'fldid',
    type: 'date',
    name: 'hello',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(DateField)
  expect(field.type).toBe('date')
  expect(field.id.value).toBe('fldid')
})

it('should create date range field', () => {
  const field = FieldFactory.create({
    id: 'fldid',
    type: 'date-range',
    name: 'hello',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(DateRangeField)
  expect(field.type).toBe('date-range')
  expect(field.id.value).toBe('fldid')
})

it('should create select field', () => {
  const field = FieldFactory.create({
    id: 'fldid',
    type: 'select',
    name: 'hello',
    options: [],
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(SelectField)
  expect(field.type).toBe('select')
  expect(field.id.value).toBe('fldid')
})

it('should create bool field', () => {
  const field = FieldFactory.create({
    id: 'fldid',
    type: 'bool',
    name: 'hello',
  })

  expectTypeOf(field).toEqualTypeOf<Field>()
  expect(field).toBeInstanceOf(BoolField)
  expect(field.type).toBe('bool')
  expect(field.id.value).toBe('fldid')
})
