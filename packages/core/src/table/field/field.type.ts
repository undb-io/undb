import type { Option } from 'oxide.ts'
import * as z from 'zod'
import type { IReferenceFilterValue } from '../filter/reference.filter.js'
import type { ICreateOptionSchema, IUpdateOptionSchema } from '../option/option.schema.js'
import type { Options } from '../option/options.js'
import type { IRecordDisplayValues } from '../record/index.js'
import type { TableId } from '../value-objects/table-id.vo.js'
import type { TableSchemaIdMap } from '../value-objects/table-schema.vo.js'
import type { AttachmentFieldValue } from './attachment-field-value.js'
import type { AttachmentField } from './attachment-field.js'
import type { IAttachmentFieldValue } from './attachment-field.type.js'
import {
  attachmentFieldQuerySchema,
  attachmentFieldQueryValue,
  attachmentTypeSchema,
  createAttachmentFieldSchema,
  createAttachmentFieldValue_internal,
  updateAttachmentFieldSchema,
} from './attachment-field.type.js'
import type { AutoIncrementFieldValue } from './auto-increment-field-value.js'
import type { AutoIncrementField } from './auto-increment-field.js'
import type { IAutoIncrementFieldValue } from './auto-increment-field.type.js'
import {
  autoIncrementFieldQuerySchema,
  autoIncrementQueryValue,
  autoIncrementTypeSchema,
  createAutoIncrementFieldSchema,
  createAutoIncrementFieldValue_internal,
  updateAutoIncrementFieldSchema,
} from './auto-increment-field.type.js'
import type { AverageFieldValue } from './average-field-value.js'
import type { AverageField } from './average-field.js'
import type { IAverageFieldValue } from './average-field.type.js'
import {
  averageFieldQuerySchema,
  averageFieldQueryValue,
  averageTypeSchema,
  createAverageFieldSchema,
  createAverageFieldValue_internal,
  updateAverageFieldSchema,
} from './average-field.type.js'
import type { BoolFieldValue } from './bool-field-value.js'
import type { BoolField } from './bool-field.js'
import type { IBoolFieldValue } from './bool-field.type.js'
import {
  boolFieldQuerySchema,
  boolFieldQueryValue,
  boolTypeSchema,
  createBoolFieldSchema,
  createBoolFieldValue_internal,
  updateBoolFieldSchema,
} from './bool-field.type.js'
import type { CollaboratorFieldValue } from './collaborator-field-value.js'
import type { CollaboratorField } from './collaborator-field.js'
import type { ICollaboratorFieldValue } from './collaborator-field.type.js'
import {
  collaboratorFieldQuerySchema,
  collaboratorFieldQueryValue,
  collaboratorTypeSchema,
  createCollaboratorFieldSchema,
  createCollaboratorFieldValue_internal,
  updateCollaboratorFieldSchema,
} from './collaborator-field.type.js'
import type { ColorFieldValue } from './color-field-value.js'
import type { ColorField } from './color-field.js'
import type { IColorFieldValue } from './color-field.type.js'
import {
  colorFieldQuerySchema,
  colorFieldQueryValue,
  colorTypeSchema,
  createColorFieldSchema,
  createColorFieldValue_internal,
  updateColorFieldSchema,
} from './color-field.type.js'
import type { CountFieldValue } from './count-field-value.js'
import type { CountField } from './count-field.js'
import type { ICountFieldValue } from './count-field.type.js'
import {
  countFieldQuerySchema,
  countFieldQueryValue,
  countTypeSchema,
  createCountFieldSchema,
  createCountFieldValue_internal,
  updateCountFieldSchema,
} from './count-field.type.js'
import type { CreatedAtFieldValue } from './created-at-field-value.js'
import type { CreatedAtField } from './created-at-field.js'
import type { ICreatedAtFieldValue } from './created-at-field.type.js'
import {
  createCreatedAtFieldSchema,
  createCreatedAtFieldValue_internal,
  createdAtFieldQuerySchema,
  createdAtFieldQueryValue,
  createdAtTypeSchema,
  updateCreatedAtFieldSchema,
} from './created-at-field.type.js'
import type { CreatedByFieldValue } from './created-by-field-value.js'
import type { CreatedByField } from './created-by-field.js'
import type { ICreatedByFieldValue } from './created-by-field.type.js'
import {
  createCreatedByFieldSchema,
  createCreatedByFieldValue_internal,
  createdByFieldQuerySchema,
  createdByFieldQueryValue,
  createdByTypeSchema,
  updateCreatedByFieldSchema,
} from './created-by-field.type.js'
import type { CurrencyFieldValue } from './currency-field-value.js'
import type { CurrencyField } from './currency-field.js'
import type { ICurrencyFieldValue } from './currency-field.type.js'
import {
  createCurrencyFieldSchema,
  createCurrencyFieldValue_internal,
  currencyFieldQuerySchema,
  currencyFieldQueryValue,
  currencyTypeSchema,
  updateCurrencyFieldSchema,
} from './currency-field.type.js'
import type { CurrencySymbol } from './currency-symbol.vo.js'
import type { DateFieldValue } from './date-field-value.js'
import type { DateField } from './date-field.js'
import type { IDateFieldValue } from './date-field.type.js'
import {
  createDateFieldSchema,
  createDateFieldValue_internal,
  dateFieldQuerySchema,
  dateFieldQueryValue,
  dateTypeSchema,
  updateDateFieldSchema,
} from './date-field.type.js'
import type { DateRangeFieldValue } from './date-range-field-value.js'
import type { DateRangeField } from './date-range-field.js'
import type { IDateRangeFieldValue } from './date-range-field.type.js'
import {
  createDateRangeFieldSchema,
  createDateRangeFieldValue_internal,
  dateRangeFieldQuerySchema,
  dateRangeFieldQueryValue,
  dateRangeTypeSchema,
  updateDateRangeFieldSchema,
} from './date-range-field.type.js'
import type { EmailFieldValue } from './email-field-value.js'
import type { EmailField } from './email-field.js'
import type { IEmailFieldValue } from './email-field.type.js'
import {
  createEmailFieldSchema,
  createEmailFieldValue_internal,
  emailFieldQuerySchema,
  emailFieldQueryValue,
  emailTypeSchema,
  updateEmailFieldSchema,
} from './email-field.type.js'
import type { BaseField } from './field.base.js'
import { FIELD_TYPE_KEY } from './field.constants.js'
import type { UrlFieldValue } from './fields/url/url-field-value.js'
import type { UrlField } from './fields/url/url-field.js'
import type { IUrlFieldValue } from './fields/url/url-field.type.js'
import {
  createUrlFieldSchema,
  createUrlFieldValue_internal,
  updateUrlFieldSchema,
  urlFieldQuerySchema,
  urlFieldQueryValue,
  urlTypeSchema,
} from './fields/url/url-field.type.js'
import type { IdFieldValue } from './id-field-value.js'
import type { IdField } from './id-field.js'
import type { IIdFieldValue } from './id-field.type.js'
import {
  createIdFieldSchema,
  createIdFieldValue_internal,
  idFieldQuerySchema,
  idFieldQueryValue,
  idTypeSchema,
  updateIdFieldSchema,
} from './id-field.type.js'
import type { JsonFieldValue } from './json-field-value.js'
import type { JsonField } from './json-field.js'
import type { IJsonFieldValue } from './json-field.type.js'
import {
  createJsonFieldSchema,
  createJsonFieldValue_internal,
  jsonFieldQuerySchema,
  jsonFieldQueryValue,
  jsonTypeSchema,
  updateJsonFieldSchema,
} from './json-field.type.js'
import type { LookupFieldValue } from './lookup-field-value.js'
import type { LookupField } from './lookup-field.js'
import type { ILookupFieldValue } from './lookup-field.type.js'
import {
  createLookupFieldSchema,
  createLookupFieldValue_internal,
  lookupFieldQuerySchema,
  lookupFieldQueryValue,
  lookupTypeSchema,
  updateLookupFieldSchema,
} from './lookup-field.type.js'
import type { MultiSelectFieldValue } from './multi-select-field-value.js'
import type { MultiSelectField } from './multi-select-field.js'
import type { IMultiSelectFieldValue } from './multi-select-field.type.js'
import {
  createMultiSelectFieldSchema,
  createMultiSelectFieldValue_internal,
  multiSelectFieldQuerySchema,
  multiSelectFieldQueryValue,
  multiSelectTypeSchema,
  updateMultiSelectFieldSchema,
} from './multi-select-field.type.js'
import type { NumberFieldValue } from './number-field-value.js'
import type { NumberField } from './number-field.js'
import type { INumberFieldValue } from './number-field.type.js'
import {
  createNumberFieldSchema,
  createNumberFieldValue_internal,
  numberFieldQuerySchema,
  numberFieldQueryValue,
  numberTypeSchema,
  updateNumberFieldSchema,
} from './number-field.type.js'
import type { ParentFieldValue } from './parent-field-value.js'
import type { ParentField } from './parent-field.js'
import type { IParentFieldValue } from './parent-field.type.js'
import {
  createParentFieldSchema,
  createParentFieldValue_internal,
  parentFieldQuerySchema,
  parentFieldQueryValue,
  parentTypeSchema,
  updateParentFieldSchema,
} from './parent-field.type.js'
import type { RatingFieldValue } from './rating-field-value.js'
import type { RatingField } from './rating-field.js'
import type { IRatingFieldValue } from './rating-field.type.js'
import {
  createRatingFieldSchema,
  createRatingFieldValue_internal,
  ratingFieldQuerySchema,
  ratingFieldQueryValue,
  ratingTypeSchema,
  updateRatingFieldSchema,
} from './rating-field.type.js'
import type { ReferenceFieldValue } from './reference-field-value.js'
import type { ReferenceField } from './reference-field.js'
import {
  createReferenceFieldSchema,
  createReferenceFieldValue_internal,
  referenceFieldQuerySchema,
  referenceFieldQueryValue,
  referenceTypeSchema,
  updateReferenceFieldSchema,
} from './reference-field.type.js'
import type { SelectFieldValue } from './select-field-value.js'
import type { SelectField } from './select-field.js'
import type { ISelectFieldValue } from './select-field.type.js'
import {
  createSelectFieldSchema,
  createSelectFieldValue_internal,
  selectFieldQuerySchema,
  selectFieldQueryValue,
  selectTypeSchema,
  updateSelectFieldSchema,
} from './select-field.type.js'
import type {
  WithNewOption,
  WithOption,
  WithOptions,
  WithoutOption,
} from './specifications/select-field.specification.js'
import type { StringFieldValue } from './string-field-value.js'
import type { StringField } from './string-field.js'
import type { IStringFieldValue } from './string-field.type.js'
import {
  createStringFieldSchema,
  createStringFieldValue_internal,
  stringFieldQuerySchema,
  stringFieldQueryValue,
  stringTypeSchema,
  updateStringFieldSchema,
} from './string-field.type.js'
import type { SumFieldValue } from './sum-field-value.js'
import type { SumField } from './sum-field.js'
import type { ISumFieldValue } from './sum-field.type.js'
import {
  createSumFieldSchema,
  createSumFieldValue_internal,
  sumFieldQuerySchema,
  sumFieldQueryValue,
  sumTypeSchema,
  updateSumFieldSchema,
} from './sum-field.type.js'
import type { TreeFieldValue } from './tree-field-value.js'
import type { TreeField } from './tree-field.js'
import type { ITreeFieldValue } from './tree-field.type.js'
import {
  createTreeFieldSchema,
  createTreeFieldValue_internal,
  treeFieldQuerySchema,
  treeFieldQueryValue,
  treeTypeSchema,
  updateTreeFieldSchema,
} from './tree-field.type.js'
import type { UpdatedAtFieldValue } from './updated-at-field-value.js'
import type { UpdatedAtField } from './updated-at-field.js'
import type { IUpdatedAtFieldValue } from './updated-at-field.type.js'
import {
  createUpdatedAtFieldSchema,
  createUpdatedAtFieldValue_internal,
  updateUpdatedAtFieldSchema,
  updatedAtFieldQuerySchema,
  updatedAtFieldQueryValue,
  updatedAtTypeSchema,
} from './updated-at-field.type.js'
import type { UpdatedByFieldValue } from './updated-by-field-value.js'
import type { UpdatedByField } from './updated-by-field.js'
import type { IUpdatedByFieldValue } from './updated-by-field.type.js'
import {
  createUpdatedByFieldSchema,
  createUpdatedByFieldValue_internal,
  updateUpdatedByFieldSchema,
  updatedByFieldQuerySchema,
  updatedByFieldQueryValue,
  updatedByTypeSchema,
} from './updated-by-field.type.js'
import type { FieldDescription } from './value-objects/field-description.js'
import type {
  DateFormat,
  DisplayFields,
  FieldId,
  FieldIssue,
  FieldName,
  FieldValueConstraints,
  TimeFormat,
} from './value-objects/index.js'

export const createFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createIdFieldSchema,
  createCreatedAtFieldSchema,
  createUpdatedAtFieldSchema,
  createAutoIncrementFieldSchema,
  createStringFieldSchema,
  createEmailFieldSchema,
  createUrlFieldSchema,
  createJsonFieldSchema,
  createColorFieldSchema,
  createNumberFieldSchema,
  createDateFieldSchema,
  createSelectFieldSchema,
  createMultiSelectFieldSchema,
  createBoolFieldSchema,
  createDateRangeFieldSchema,
  createReferenceFieldSchema,
  createTreeFieldSchema,
  createParentFieldSchema,
  createRatingFieldSchema,
  createCurrencyFieldSchema,
  createCountFieldSchema,
  createLookupFieldSchema,
  createSumFieldSchema,
  createAverageFieldSchema,
  createAttachmentFieldSchema,
  createCollaboratorFieldSchema,
  createCreatedByFieldSchema,
  createUpdatedByFieldSchema,
])
export type ICreateFieldSchema = z.infer<typeof createFieldSchema>

export const updateFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  updateIdFieldSchema,
  updateCreatedAtFieldSchema,
  updateUpdatedAtFieldSchema,
  updateAutoIncrementFieldSchema,
  updateStringFieldSchema,
  updateEmailFieldSchema,
  updateUrlFieldSchema,
  updateJsonFieldSchema,
  updateColorFieldSchema,
  updateNumberFieldSchema,
  updateDateFieldSchema,
  updateSelectFieldSchema,
  updateMultiSelectFieldSchema,
  updateBoolFieldSchema,
  updateDateRangeFieldSchema,
  updateReferenceFieldSchema,
  updateTreeFieldSchema,
  updateParentFieldSchema,
  updateRatingFieldSchema,
  updateCurrencyFieldSchema,
  updateCountFieldSchema,
  updateLookupFieldSchema,
  updateSumFieldSchema,
  updateAverageFieldSchema,
  updateAttachmentFieldSchema,
  updateCollaboratorFieldSchema,
  updateCreatedByFieldSchema,
  updateUpdatedByFieldSchema,
])
export type IUpdateFieldSchema = z.infer<typeof updateFieldSchema>

export const queryFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  idFieldQuerySchema,
  createdAtFieldQuerySchema,
  updatedAtFieldQuerySchema,
  autoIncrementFieldQuerySchema,
  stringFieldQuerySchema,
  emailFieldQuerySchema,
  urlFieldQuerySchema,
  jsonFieldQuerySchema,
  colorFieldQuerySchema,
  numberFieldQuerySchema,
  dateFieldQuerySchema,
  selectFieldQuerySchema,
  multiSelectFieldQuerySchema,
  boolFieldQuerySchema,
  dateRangeFieldQuerySchema,
  referenceFieldQuerySchema,
  treeFieldQuerySchema,
  parentFieldQuerySchema,
  ratingFieldQuerySchema,
  currencyFieldQuerySchema,
  countFieldQuerySchema,
  lookupFieldQuerySchema,
  sumFieldQuerySchema,
  averageFieldQuerySchema,
  attachmentFieldQuerySchema,
  collaboratorFieldQuerySchema,
  createdByFieldQuerySchema,
  updatedByFieldQuerySchema,
])
export type IQueryFieldSchema = z.infer<typeof queryFieldSchema>
export const querySchemaSchema = z.array(queryFieldSchema)
export type IQuerySchemaSchema = z.infer<typeof querySchemaSchema>

export const fieldTypes = z.union([
  idTypeSchema,
  createdAtTypeSchema,
  updatedAtTypeSchema,
  autoIncrementTypeSchema,
  stringTypeSchema,
  colorTypeSchema,
  emailTypeSchema,
  urlTypeSchema,
  jsonTypeSchema,
  numberTypeSchema,
  dateTypeSchema,
  selectTypeSchema,
  multiSelectTypeSchema,
  boolTypeSchema,
  dateRangeTypeSchema,
  referenceTypeSchema,
  treeTypeSchema,
  parentTypeSchema,
  ratingTypeSchema,
  currencyTypeSchema,
  countTypeSchema,
  lookupTypeSchema,
  sumTypeSchema,
  averageTypeSchema,
  attachmentTypeSchema,
  collaboratorTypeSchema,
  createdByTypeSchema,
  updatedByTypeSchema,
])
export type IFieldType = z.infer<typeof fieldTypes>

export const createFieldValueSchema_internal = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createIdFieldValue_internal,
  createCreatedAtFieldValue_internal,
  createUpdatedAtFieldValue_internal,
  createAutoIncrementFieldValue_internal,
  createStringFieldValue_internal,
  createEmailFieldValue_internal,
  createUrlFieldValue_internal,
  createJsonFieldValue_internal,
  createColorFieldValue_internal,
  createNumberFieldValue_internal,
  createDateFieldValue_internal,
  createSelectFieldValue_internal,
  createMultiSelectFieldValue_internal,
  createBoolFieldValue_internal,
  createDateRangeFieldValue_internal,
  createReferenceFieldValue_internal,
  createTreeFieldValue_internal,
  createParentFieldValue_internal,
  createRatingFieldValue_internal,
  createCurrencyFieldValue_internal,
  createCountFieldValue_internal,
  createLookupFieldValue_internal,
  createSumFieldValue_internal,
  createAverageFieldValue_internal,
  createAttachmentFieldValue_internal,
  createCollaboratorFieldValue_internal,
  createCreatedByFieldValue_internal,
  createUpdatedByFieldValue_internal,
])
export type ICreateFieldValueSchema_internal = z.infer<typeof createFieldValueSchema_internal>

export const createFieldsSchema_internal = z.array(createFieldValueSchema_internal)
export type ICreateFieldsSchema_internal = z.infer<typeof createFieldsSchema_internal>

export interface IBaseFieldQueryScheam {
  id: string
  name: string
  display: boolean
  description?: string
  type: IFieldType
  required: boolean
}

export interface IBaseField {
  id: FieldId
  system?: boolean
  display?: boolean
  name: FieldName
  description?: FieldDescription
  valueConstrains: FieldValueConstraints
}

export type BaseDateField = { format?: DateFormat; timeFormat?: TimeFormat }

export type IIdField = IBaseField
export type ICreatedAtField = IBaseField & BaseDateField
export type ICreatedByField = IBaseField
export type IUpdatedAtField = IBaseField & BaseDateField
export type IUpdatedByField = IBaseField
export type IAutoIncrementField = IBaseField
export type IStringField = IBaseField
export type IEmailField = IBaseField
export type IJsonField = IBaseField
export type IAttachmentField = IBaseField
export type IColorField = IBaseField

export type INumberField = IBaseField
export type IRatingField = IBaseField & { max?: number }
export type ICurrencyField = IBaseField & { symbol: CurrencySymbol }

export type IDateField = IBaseField & BaseDateField
export type IDateRangeField = IBaseField & BaseDateField
export type ISelectField = IBaseField & {
  options: Options
}
export type IMultiSelectField = IBaseField & { options: Options }

export type IBoolField = IBaseField

export type ICollaboratorField = IBaseField

export type IReferenceField = IBaseField & {
  displayFields?: DisplayFields
  foreignTableId?: TableId
  isOwner?: boolean
  symmetricReferenceFieldId?: FieldId
}
export type ITreeField = IBaseField & { parentFieldId?: FieldId; displayFields?: DisplayFields }
export type IParentField = IBaseField & { treeFieldId: FieldId; displayFields?: DisplayFields }

export type ICountField = IBaseField & { referenceFieldId: FieldId }
export type ISumField = IBaseField & { referenceFieldId: FieldId; aggregateFieldId: FieldId }
export type IAverageField = IBaseField & { referenceFieldId: FieldId; aggregateFieldId: FieldId }
export type ILookupField = IBaseField & { referenceFieldId: FieldId; displayFields?: DisplayFields }

export type SystemField = IdField | CreatedAtField | UpdatedAtField | CreatedByField | UpdatedByField

export type IReferenceFieldTypes = IReferenceField | ITreeField | IParentField
export type ReferenceFieldTypes = ReferenceField | TreeField | ParentField
export type ILookingFieldTypes = IReferenceFieldTypes | ILookupField
export type LookingFieldTypes = ReferenceFieldTypes | LookupField
export type AggregateFieldType = CountField | SumField
export type INumberAggregateFieldType = ISumField | IAverageField
export type ISelectFieldTypes = ISelectField | IMultiSelectField
export type SelectFieldTypes = SelectField | MultiSelectField
export type IDateFieldTypes = IDateField | IDateRangeField | ICreatedAtField | IUpdatedAtField
export type DateFieldTypes = DateField | DateRangeField | CreatedAtField | UpdatedAtField
export type ILookupFieldTypes = ICountField | ILookupField
export type LookupFieldTypes = CountField | LookupField

export type NoneSystemField =
  | StringField
  | NumberField
  | EmailField
  | UrlField
  | JsonField
  | ColorField
  | DateField
  | SelectField
  | MultiSelectField
  | BoolField
  | DateRangeField
  | ReferenceField
  | TreeField
  | ParentField
  | RatingField
  | CurrencyField
  | AutoIncrementField
  | CountField
  | LookupField
  | SumField
  | AverageField
  | AttachmentField
  | CollaboratorField

export type PrimitiveField =
  | StringField
  | NumberField
  | EmailField
  | UrlField
  | JsonField
  | ColorField
  | DateField
  | SelectField
  | MultiSelectField
  | BoolField
  | DateRangeField
  | RatingField
  | CurrencyField
  | CreatedAtFieldValue
  | UpdatedAtFieldValue
  | AutoIncrementFieldValue
  | CountField
  | SumField
  | AverageField

export type Field = SystemField | NoneSystemField

export type FieldValue =
  | IdFieldValue
  | CreatedAtFieldValue
  | UpdatedAtFieldValue
  | AutoIncrementFieldValue
  | StringFieldValue
  | EmailFieldValue
  | UrlFieldValue
  | JsonFieldValue
  | ColorFieldValue
  | NumberFieldValue
  | DateFieldValue
  | SelectFieldValue
  | MultiSelectFieldValue
  | BoolFieldValue
  | DateRangeFieldValue
  | ReferenceFieldValue
  | TreeFieldValue
  | ParentFieldValue
  | RatingFieldValue
  | CurrencyFieldValue
  | CountFieldValue
  | LookupFieldValue
  | SumFieldValue
  | AverageFieldValue
  | AttachmentFieldValue
  | CollaboratorFieldValue
  | CreatedByFieldValue
  | UpdatedByFieldValue

export type FieldValues = FieldValue[]

export type UnpackedFieldValue =
  | IIdFieldValue
  | ICreatedAtFieldValue
  | IUpdatedAtFieldValue
  | IAutoIncrementFieldValue
  | IStringFieldValue
  | IEmailFieldValue
  | IUrlFieldValue
  | IJsonFieldValue
  | IColorFieldValue
  | INumberFieldValue
  | IDateFieldValue
  | ISelectFieldValue
  | IMultiSelectFieldValue
  | IBoolFieldValue
  | IDateRangeFieldValue
  | IReferenceFilterValue
  | ITreeFieldValue
  | IParentFieldValue
  | IRatingFieldValue
  | ICurrencyFieldValue
  | ICountFieldValue
  | ILookupFieldValue
  | ISumFieldValue
  | IAverageFieldValue
  | IAttachmentFieldValue
  | ICollaboratorFieldValue
  | ICreatedByFieldValue
  | IUpdatedByFieldValue

export const fieldQueryValue = z.union([
  treeFieldQueryValue,
  autoIncrementQueryValue,
  boolFieldQueryValue,
  colorFieldQueryValue,
  createdAtFieldQueryValue,
  dateFieldQueryValue,
  dateRangeFieldQueryValue,
  emailFieldQueryValue,
  urlFieldQueryValue,
  jsonFieldQueryValue,
  idFieldQueryValue,
  numberFieldQueryValue,
  parentFieldQueryValue,
  referenceFieldQueryValue,
  selectFieldQueryValue,
  multiSelectFieldQueryValue,
  stringFieldQueryValue,
  updatedAtFieldQueryValue,
  ratingFieldQueryValue,
  currencyFieldQueryValue,
  countFieldQueryValue,
  lookupFieldQueryValue,
  sumFieldQueryValue,
  averageFieldQueryValue,
  attachmentFieldQueryValue,
  collaboratorFieldQueryValue,
  createdByFieldQueryValue,
  updatedByFieldQueryValue,
])

export type IFieldQueryValue = z.infer<typeof fieldQueryValue>

export interface IAbstractReferenceField {
  get foreignTableId(): Option<string>
}

export interface IAbstractLookingField extends BaseField {
  type: ILookingFieldType
  get multiple(): boolean
  get displayFieldIds(): FieldId[]
  set displayFieldIds(fieldIds: FieldId[])
  getDisplayValues(values: IRecordDisplayValues): ((string | null)[] | undefined)[]
}

export const lookingFieldTypes = z.union([lookupTypeSchema, parentTypeSchema, treeTypeSchema, referenceTypeSchema])
export type ILookingFieldType = z.infer<typeof lookingFieldTypes>

export interface IAbstractDateField {
  type: IDateFieldType
  get formatString(): string
  get format(): DateFormat | undefined
  set format(format: DateFormat | undefined)
  get timeFormatString(): string | null
  get timeFormat(): TimeFormat | undefined
  set timeFormat(format: TimeFormat | undefined)
}

export const dateFieldType = z.union([dateTypeSchema, dateRangeTypeSchema, createdAtTypeSchema, updatedAtTypeSchema])
export type IDateFieldType = z.infer<typeof dateFieldType>

export const lookingFieldIssues = z.enum(['Missing Reference Field'])
export type ILookingFieldIssues = z.infer<typeof lookingFieldIssues>

export type LookingFieldIssue = FieldIssue<ILookingFieldIssues>

export interface IAbstractLookupField {
  type: ILookupFieldType
  get referenceFieldId(): FieldId
  set referenceFieldId(fieldId: FieldId)
  getIssues(schema: TableSchemaIdMap): LookingFieldIssue[]
  mustGetReferenceField(schema: TableSchemaIdMap): ReferenceField | TreeField
  getReferenceField(schema: TableSchemaIdMap): ReferenceField | TreeField | undefined
  getForeignTableId(schema: TableSchemaIdMap): Option<string>
}

export const lookupFieldType = z.union([sumTypeSchema, averageTypeSchema, countTypeSchema, lookupTypeSchema])
export type ILookupFieldType = z.infer<typeof lookupFieldType>

export interface IAbstractAggregateField {
  type: IAggregateFieldType
  get aggregateFieldId(): FieldId
  set aggregateFieldId(fieldId: FieldId)
}

export const aggregateFieldType = z.union([sumTypeSchema, averageTypeSchema])
export type IAggregateFieldType = z.infer<typeof aggregateFieldType>

export interface IAbstractSelectField extends BaseField {
  type: ISelectFieldType
  get options(): Options
  set options(options: Options)
  reorder(from: string, to: string): WithOptions
  createOption(input: ICreateOptionSchema): WithNewOption
  updateOption(id: string, input: IUpdateOptionSchema): WithOption
  removeOption(id: string): WithoutOption
}

export const selectFieldType = z.union([selectTypeSchema, multiSelectTypeSchema])
export type ISelectFieldType = z.infer<typeof selectFieldType>
