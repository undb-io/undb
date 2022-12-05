import * as z from 'zod'
import type { INumberFieldValue } from './number-field.type'
import {
  createNumberFieldSchema,
  createNumberFieldValue,
  createNumberFieldValue_internal,
  numberFieldQuerySchema,
  numberFieldValue,
  numberTypeSchema,
} from './number-field.type'
import type { ITextFieldValue } from './text-field.type'
import {
  createTextFieldSchema,
  createTextFieldValue,
  createTextFieldValue_internal,
  textFieldQuerySchema,
  textFieldValue,
  textTypeSchema,
} from './text-field.type'
import type { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export const createFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [createTextFieldSchema, createNumberFieldSchema])
export type ICreateFieldSchema = z.infer<typeof createFieldSchema>

export const queryFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [textFieldQuerySchema, numberFieldQuerySchema])
export type IQueryFieldSchema = z.infer<typeof queryFieldSchema>
export const querySchemaSchema = z.array(queryFieldSchema)
export type IQuerySchemaSchema = z.infer<typeof querySchemaSchema>

export const fieldTypes = z.union([textTypeSchema, numberTypeSchema])
export type IFieldType = z.infer<typeof fieldTypes>

export const fieldValue = z.union([textFieldValue, numberFieldValue])
export type IFieldValue = z.infer<typeof fieldValue>

export const createFieldValueSchema = z.union([createTextFieldValue, createNumberFieldValue])
export type ICreateFieldValue = z.infer<typeof createFieldValueSchema>

export const createFieldValueSchema_internal = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createTextFieldValue_internal,
  createNumberFieldValue_internal,
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
export type INumberField = IBaseField

import { FIELD_TYPE_KEY } from './field.constant'
import type { NumberFieldValue } from './number-field-value'
import type { NumberField } from './number.field'
import type { TextFieldValue } from './text-field-value'
import type { TextField } from './text.field'

export type Field = TextField | NumberField

export type FieldValue = TextFieldValue | NumberFieldValue
export type FieldValues = FieldValue[]

export type UnpackedFieldValue = ITextFieldValue | INumberFieldValue
