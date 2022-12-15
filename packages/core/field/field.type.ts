import type { Option } from 'oxide.ts'
import * as z from 'zod'
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
import type { TextFieldValue } from './text-field-value'
import type { ITextFieldValue } from './text-field.type'
import {
  createTextFieldSchema,
  createTextFieldValue,
  createTextFieldValue_internal,
  textFieldQuerySchema,
  textFieldValue,
  textTypeSchema,
} from './text-field.type'
import type { TextField } from './text.field'
import type { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export const createFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createTextFieldSchema,
  createNumberFieldSchema,
  createDateFieldSchema,
])
export type ICreateFieldSchema = z.infer<typeof createFieldSchema>

export const queryFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  textFieldQuerySchema,
  numberFieldQuerySchema,
  dateFieldQuerySchema,
])
export type IQueryFieldSchema = z.infer<typeof queryFieldSchema>
export const querySchemaSchema = z.array(queryFieldSchema)
export type IQuerySchemaSchema = z.infer<typeof querySchemaSchema>

export const fieldTypes = z.union([textTypeSchema, numberTypeSchema, dateTypeSchema])
export type IFieldType = z.infer<typeof fieldTypes>

export const fieldValue = z.union([textFieldValue, numberFieldValue, dateFieldValue])
export type IFieldValue = z.infer<typeof fieldValue>

export const createFieldValueSchema = z.union([createTextFieldValue, createNumberFieldValue, createDateFieldValue])
export type ICreateFieldValue = z.infer<typeof createFieldValueSchema>

export const createFieldValueSchema_internal = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createTextFieldValue_internal,
  createNumberFieldValue_internal,
  createDateFieldValue_internal,
])
export type ICreateFieldValueSchema_internal = z.infer<typeof createFieldValueSchema_internal>

export const createFieldsSchema_internal = z.array(createFieldValueSchema_internal)
export type ICreateFieldsSchema_internal = z.infer<typeof createFieldsSchema_internal>

export interface IBaseField {
  id: FieldId
  name: FieldName
  valueConstrains: FieldValueConstraints
}

export type ITextField = IBaseField
export interface INumberField extends IBaseField {
  currency: Option<Currency>
}

export type IDateField = IBaseField

export type Field = TextField | NumberField | DateField

export type FieldValue = TextFieldValue | NumberFieldValue | DateFieldValue
export type FieldValues = FieldValue[]

export type UnpackedFieldValue = ITextFieldValue | INumberFieldValue | IDateFieldValue
