import type { Option } from 'oxide.ts'
import * as z from 'zod'
import type { IReferenceFilterValue } from '../filter/reference.filter'
import type { Options } from '../option/options'
import type { BoolField } from './bool-field'
import type { BoolFieldValue } from './bool-field-value'
import type { IBoolFieldValue } from './bool-field.type'
import {
  boolFieldQuerySchema,
  boolFieldValue,
  boolTypeSchema,
  createBoolFieldSchema,
  createBoolFieldValue,
  createBoolFieldValue_internal,
} from './bool-field.type'
import type { CreatedAtField } from './created-at-field'
import type { CreatedAtFieldValue } from './created-at-field-value'
import type { ICreatedAtFieldValue } from './created-at-field.type'
import {
  createCreatedAtFieldSchema,
  createCreatedAtFieldValue,
  createCreatedAtFieldValue_internal,
  createdAtFieldQuerySchema,
  createdAtFieldValue,
  createdAtTypeSchema,
} from './created-at-field.type'
import type { Currency } from './currency'
import type { DateField } from './date-field'
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
import type { DateRangeField } from './date-range-field'
import type { DateRangeFieldValue } from './date-range-field-value'
import type { IDateRangeFieldValue } from './date-range-field.type'
import {
  createDateRangeFieldSchema,
  createDateRangeFieldValue,
  createDateRangeFieldValue_internal,
  dateRangeFieldQuerySchema,
  dateRangeFieldValue,
  dateRangeTypeSchema,
} from './date-range-field.type'
import { FIELD_TYPE_KEY } from './field.constant'
import type { IdField } from './id-field'
import type { IdFieldValue } from './id-field-value'
import type { IIdFieldValue } from './id-field.type'
import {
  createIdFieldSchema,
  createIdFieldValue,
  createIdFieldValue_internal,
  idFieldQuerySchema,
  idFieldValue,
  idTypeSchema,
} from './id-field.type'
import type { NumberField } from './number-field'
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
import type { ReferenceField } from './reference-field'
import type { ReferenceFieldValue } from './reference-field-value'
import {
  createReferenceFieldSchema,
  createReferenceFieldValue,
  createReferenceFieldValue_internal,
  referenceFieldQuerySchema,
  referenceFieldValue,
  referenceTypeSchema,
} from './reference-field.type'
import type { SelectField } from './select-field'
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
import type { StringField } from './string-field'
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
import type { TreeField } from './tree-field'
import type { TreeFieldValue } from './tree-field-value'
import type { ITreeFieldValue } from './tree-field.type'
import {
  createTreeFieldSchema,
  createTreeFieldValue,
  createTreeFieldValue_internal,
  treeFieldQuerySchema,
  treeFieldValue,
  treeTypeSchema,
} from './tree-field.type'
import type { FieldId, FieldKey, FieldName, FieldValueConstraints } from './value-objects'
import { fieldNameSchema } from './value-objects/field-name.schema'

export const createFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createIdFieldSchema,
  createCreatedAtFieldSchema,
  createStringFieldSchema,
  createNumberFieldSchema,
  createDateFieldSchema,
  createSelectFieldSchema,
  createBoolFieldSchema,
  createDateRangeFieldSchema,
  createReferenceFieldSchema,
  createTreeFieldSchema,
])
export type ICreateFieldSchema = z.infer<typeof createFieldSchema>

export const queryFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  idFieldQuerySchema,
  createdAtFieldQuerySchema,
  stringFieldQuerySchema,
  numberFieldQuerySchema,
  dateFieldQuerySchema,
  selectFieldQuerySchema,
  boolFieldQuerySchema,
  dateRangeFieldQuerySchema,
  referenceFieldQuerySchema,
  treeFieldQuerySchema,
])
export type IQueryFieldSchema = z.infer<typeof queryFieldSchema>
export const querySchemaSchema = z.array(queryFieldSchema)
export type IQuerySchemaSchema = z.infer<typeof querySchemaSchema>

export const fieldTypes = z.union([
  idTypeSchema,
  createdAtTypeSchema,
  stringTypeSchema,
  numberTypeSchema,
  dateTypeSchema,
  selectTypeSchema,
  boolTypeSchema,
  dateRangeTypeSchema,
  referenceTypeSchema,
  treeTypeSchema,
])
export type IFieldType = z.infer<typeof fieldTypes>

export const fieldValue = z.union([
  idFieldValue,
  createdAtFieldValue,
  stringFieldValue,
  numberFieldValue,
  dateFieldValue,
  dateRangeFieldValue,
  selectFieldValue,
  boolFieldValue,
  referenceFieldValue,
  treeFieldValue,
])
export type IFieldValue = z.infer<typeof fieldValue>

export const createFieldValueSchema = z.union([
  createIdFieldValue,
  createCreatedAtFieldValue,
  createStringFieldValue,
  createNumberFieldValue,
  createDateFieldValue,
  createDateRangeFieldValue,
  createSelectFieldValue,
  createBoolFieldValue,
  createReferenceFieldValue,
  createTreeFieldValue,
])
export type ICreateFieldValue = z.infer<typeof createFieldValueSchema>

export const createFieldValueObject = z.record(fieldNameSchema, createFieldValueSchema)
export type ICreateFieldValueObject = z.infer<typeof createFieldValueObject>

export const createFieldValueSchema_internal = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createIdFieldValue_internal,
  createCreatedAtFieldValue_internal,
  createStringFieldValue_internal,
  createNumberFieldValue_internal,
  createDateFieldValue_internal,
  createSelectFieldValue_internal,
  createBoolFieldValue_internal,
  createDateRangeFieldValue_internal,
  createReferenceFieldValue_internal,
  createTreeFieldValue_internal,
])
export type ICreateFieldValueSchema_internal = z.infer<typeof createFieldValueSchema_internal>

export const createFieldsSchema_internal = z.array(createFieldValueSchema_internal)
export type ICreateFieldsSchema_internal = z.infer<typeof createFieldsSchema_internal>

export interface IBaseField {
  id: FieldId
  system?: boolean
  key: FieldKey
  name: FieldName
  valueConstrains: FieldValueConstraints
}

export type IIdField = IBaseField
export type ICreatedAtField = IBaseField
export type IStringField = IBaseField
export interface INumberField extends IBaseField {
  currency: Option<Currency>
}

export type IDateField = IBaseField
export type IDateRangeField = IBaseField
export type ISelectField = IBaseField & {
  options: Options
}

export type IBoolField = IBaseField
export type IReferenceField = IBaseField
export type ITreeField = IBaseField

export type SystemField = IdField | CreatedAtField

export type NoneSystemField =
  | StringField
  | NumberField
  | DateField
  | SelectField
  | BoolField
  | DateRangeField
  | ReferenceField
  | TreeField

export type Field = SystemField | NoneSystemField

export type FieldValue =
  | IdFieldValue
  | CreatedAtFieldValue
  | StringFieldValue
  | NumberFieldValue
  | DateFieldValue
  | SelectFieldValue
  | BoolFieldValue
  | DateRangeFieldValue
  | ReferenceFieldValue
  | TreeFieldValue

export type FieldValues = FieldValue[]

export type UnpackedFieldValue =
  | IIdFieldValue
  | ICreatedAtFieldValue
  | IStringFieldValue
  | INumberFieldValue
  | IDateFieldValue
  | ISelectFieldValue
  | IBoolFieldValue
  | IDateRangeFieldValue
  | IReferenceFilterValue
  | ITreeFieldValue

export const INTERNAL_COLUMN_ID_NAME = 'id'
export const INTERNAL_INCREAMENT_ID_NAME = 'auto_increment'
export const INTERNAL_COLUMN_CREATED_AT_NAME = 'created_at'
export const INTERNAL_COLUMN_UPDATED_AT_NAME = 'updated_at'
