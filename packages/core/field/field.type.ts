import type { Option } from 'oxide.ts'
import * as z from 'zod'
import type { Options } from '../option/options'
import type { Currency } from './currency'
import type { DateFieldValue } from './date-field-value'
import type { IDateFieldValue } from './date-field.type'
import {
  createDateFieldSchema,
  createDateFieldValue,
  createDateFieldValue_internal,
  dateFieldQuerySchema,
  dateFieldValue,
  dateTypeSchema,
} from './date-field.type'
import type { DateField } from './date.field'
import { FIELD_TYPE_KEY } from './field.constant'
import type { NumberFieldValue } from './number-field-value'
import type { INumberFieldValue } from './number-field.type'
import {
  createNumberFieldSchema,
  createNumberFieldValue,
  createNumberFieldValue_internal,
  numberFieldQuerySchema,
  numberFieldValue,
  numberTypeSchema,
} from './number-field.type'
import type { NumberField } from './number.field'
import type { SelectFieldValue } from './select-field-value'
import type { ISelectFieldValue } from './select-field.type'
import {
  createSelectFieldSchema,
  createSelectFieldValue,
  createSelectFieldValue_internal,
  selectFieldQuerySchema,
  selectFieldValue,
  selectTypeSchema,
} from './select-field.type'
import type { SelectField } from './select.field'
import type { StringFieldValue } from './string-field-value'
import type { IStringFieldValue } from './string-field.type'
import {
  createStringFieldSchema,
  createStringFieldValue,
  createStringFieldValue_internal,
  stringFieldQuerySchema,
  stringFieldValue,
  stringTypeSchema,
} from './string-field.type'
import type { StringField } from './string.field'
import type { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export const createFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createStringFieldSchema,
  createNumberFieldSchema,
  createDateFieldSchema,
  createSelectFieldSchema,
])
export type ICreateFieldSchema = z.infer<typeof createFieldSchema>

export const queryFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  stringFieldQuerySchema,
  numberFieldQuerySchema,
  dateFieldQuerySchema,
  selectFieldQuerySchema,
])
export type IQueryFieldSchema = z.infer<typeof queryFieldSchema>
export const querySchemaSchema = z.array(queryFieldSchema)
export type IQuerySchemaSchema = z.infer<typeof querySchemaSchema>

export const fieldTypes = z.union([stringTypeSchema, numberTypeSchema, dateTypeSchema, selectTypeSchema])
export type IFieldType = z.infer<typeof fieldTypes>

export const fieldValue = z.union([stringFieldValue, numberFieldValue, dateFieldValue, selectFieldValue])
export type IFieldValue = z.infer<typeof fieldValue>

export const createFieldValueSchema = z.union([
  createStringFieldValue,
  createNumberFieldValue,
  createDateFieldValue,
  createSelectFieldValue,
])
export type ICreateFieldValue = z.infer<typeof createFieldValueSchema>

export const createFieldValueSchema_internal = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createStringFieldValue_internal,
  createNumberFieldValue_internal,
  createDateFieldValue_internal,
  createSelectFieldValue_internal,
])
export type ICreateFieldValueSchema_internal = z.infer<typeof createFieldValueSchema_internal>

export const createFieldsSchema_internal = z.array(createFieldValueSchema_internal)
export type ICreateFieldsSchema_internal = z.infer<typeof createFieldsSchema_internal>

export interface IBaseField {
  id: FieldId
  name: FieldName
  valueConstrains: FieldValueConstraints
}

export type IStringField = IBaseField
export interface INumberField extends IBaseField {
  currency: Option<Currency>
}

export type IDateField = IBaseField
export type ISelectField = IBaseField & {
  options: Options
}

export type Field = StringField | NumberField | DateField | SelectField

export type FieldValue = StringFieldValue | NumberFieldValue | DateFieldValue | SelectFieldValue
export type FieldValues = FieldValue[]

export type UnpackedFieldValue = IStringFieldValue | INumberFieldValue | IDateFieldValue | ISelectFieldValue
