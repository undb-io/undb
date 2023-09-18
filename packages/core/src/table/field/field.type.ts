import type { Option } from 'oxide.ts'
import * as z from 'zod'
import type { ICreateOptionSchema, IUpdateOptionSchema } from '../option/option.schema.js'
import type { Options } from '../option/options.js'
import type { IRecordDisplayValues } from '../record/index.js'
import type { TableSchemaIdMap } from '../value-objects/table-schema.vo.js'
import type { BaseField } from './field.base.js'
import { FIELD_TYPE_KEY } from './field.constants.js'
import type { AttachmentFieldValue } from './fields/attachment/attachment-field-value.js'
import type { AttachmentField } from './fields/attachment/attachment-field.js'
import type { IAttachmentFieldValue } from './fields/attachment/attachment-field.type.js'
import {
  attachmentFieldQuerySchema,
  attachmentFieldQueryValue,
  attachmentTypeSchema,
  createAttachmentFieldSchema,
  createAttachmentFieldValue_internal,
  updateAttachmentFieldSchema,
} from './fields/attachment/attachment-field.type.js'
import type { AutoIncrementFieldValue } from './fields/auto-increment/auto-increment-field-value.js'
import type { AutoIncrementField } from './fields/auto-increment/auto-increment-field.js'
import type { IAutoIncrementFieldValue } from './fields/auto-increment/auto-increment-field.type.js'
import {
  autoIncrementFieldQuerySchema,
  autoIncrementQueryValue,
  autoIncrementTypeSchema,
  createAutoIncrementFieldSchema,
  createAutoIncrementFieldValue_internal,
  updateAutoIncrementFieldSchema,
} from './fields/auto-increment/auto-increment-field.type.js'
import type { AverageFieldValue } from './fields/average/average-field-value.js'
import type { AverageField } from './fields/average/average-field.js'
import type { IAverageField, IAverageFieldValue } from './fields/average/average-field.type.js'
import {
  averageFieldQuerySchema,
  averageFieldQueryValue,
  averageTypeSchema,
  createAverageFieldSchema,
  createAverageFieldValue_internal,
  updateAverageFieldSchema,
} from './fields/average/average-field.type.js'
import type { BoolFieldValue } from './fields/bool/bool-field-value.js'
import type { BoolField } from './fields/bool/bool-field.js'
import type { IBoolFieldValue } from './fields/bool/bool-field.type.js'
import {
  boolFieldQuerySchema,
  boolFieldQueryValue,
  boolTypeSchema,
  createBoolFieldSchema,
  createBoolFieldValue_internal,
  updateBoolFieldSchema,
} from './fields/bool/bool-field.type.js'
import type { CollaboratorFieldValue } from './fields/collaborator/collaborator-field-value.js'
import type { CollaboratorField } from './fields/collaborator/collaborator-field.js'
import type { ICollaboratorFieldValue } from './fields/collaborator/collaborator-field.type.js'
import {
  collaboratorFieldQuerySchema,
  collaboratorFieldQueryValue,
  collaboratorTypeSchema,
  createCollaboratorFieldSchema,
  createCollaboratorFieldValue_internal,
  updateCollaboratorFieldSchema,
} from './fields/collaborator/collaborator-field.type.js'
import type { ColorFieldValue } from './fields/color/color-field-value.js'
import type { ColorField } from './fields/color/color-field.js'
import type { IColorFieldValue } from './fields/color/color-field.type.js'
import {
  colorFieldQuerySchema,
  colorFieldQueryValue,
  colorTypeSchema,
  createColorFieldSchema,
  createColorFieldValue_internal,
  updateColorFieldSchema,
} from './fields/color/color-field.type.js'
import type { CountFieldValue } from './fields/count/count-field-value.js'
import type { CountField } from './fields/count/count-field.js'
import type { ICountField, ICountFieldValue } from './fields/count/count-field.type.js'
import {
  countFieldQuerySchema,
  countFieldQueryValue,
  countTypeSchema,
  createCountFieldSchema,
  createCountFieldValue_internal,
  updateCountFieldSchema,
} from './fields/count/count-field.type.js'
import type { CreatedAtFieldValue } from './fields/created-at/created-at-field-value.js'
import type { CreatedAtField } from './fields/created-at/created-at-field.js'
import type { ICreatedAtField, ICreatedAtFieldValue } from './fields/created-at/created-at-field.type.js'
import {
  createCreatedAtFieldSchema,
  createCreatedAtFieldValue_internal,
  createdAtFieldQuerySchema,
  createdAtFieldQueryValue,
  createdAtTypeSchema,
  updateCreatedAtFieldSchema,
} from './fields/created-at/created-at-field.type.js'
import type { CreatedByFieldValue } from './fields/created-by/created-by-field-value.js'
import type { CreatedByField } from './fields/created-by/created-by-field.js'
import type { ICreatedByFieldValue } from './fields/created-by/created-by-field.type.js'
import {
  createCreatedByFieldSchema,
  createCreatedByFieldValue_internal,
  createdByFieldQuerySchema,
  createdByFieldQueryValue,
  createdByTypeSchema,
  updateCreatedByFieldSchema,
} from './fields/created-by/created-by-field.type.js'
import type { CurrencyFieldValue } from './fields/currency/currency-field-value.js'
import type { CurrencyField } from './fields/currency/currency-field.js'
import type { ICurrencyFieldValue } from './fields/currency/currency-field.type.js'
import {
  createCurrencyFieldSchema,
  createCurrencyFieldValue_internal,
  currencyFieldQuerySchema,
  currencyFieldQueryValue,
  currencyTypeSchema,
  updateCurrencyFieldSchema,
} from './fields/currency/currency-field.type.js'
import type { DateRangeFieldValue } from './fields/date-range/date-range-field-value.js'
import type { DateRangeField } from './fields/date-range/date-range-field.js'
import type { IDateRangeField, IDateRangeFieldValue } from './fields/date-range/date-range-field.type.js'
import {
  createDateRangeFieldSchema,
  createDateRangeFieldValue_internal,
  dateRangeFieldQuerySchema,
  dateRangeFieldQueryValue,
  dateRangeTypeSchema,
  updateDateRangeFieldSchema,
} from './fields/date-range/date-range-field.type.js'
import type { DateFieldValue } from './fields/date/date-field-value.js'
import type { DateField } from './fields/date/date-field.js'
import type { IDateField, IDateFieldValue } from './fields/date/date-field.type.js'
import {
  createDateFieldSchema,
  createDateFieldValue_internal,
  dateFieldQuerySchema,
  dateFieldQueryValue,
  dateTypeSchema,
  updateDateFieldSchema,
} from './fields/date/date-field.type.js'
import type { EmailFieldValue } from './fields/email/email-field-value.js'
import type { EmailField } from './fields/email/email-field.js'
import type { IEmailFieldValue } from './fields/email/email-field.type.js'
import {
  createEmailFieldSchema,
  createEmailFieldValue_internal,
  emailFieldQuerySchema,
  emailFieldQueryValue,
  emailTypeSchema,
  updateEmailFieldSchema,
} from './fields/email/email-field.type.js'
import type { IdFieldValue } from './fields/id/id-field-value.js'
import type { IdField } from './fields/id/id-field.js'
import type { IIdFieldValue } from './fields/id/id-field.type.js'
import {
  createIdFieldSchema,
  createIdFieldValue_internal,
  idFieldQuerySchema,
  idFieldQueryValue,
  idTypeSchema,
  updateIdFieldSchema,
} from './fields/id/id-field.type.js'
import type { JsonFieldValue } from './fields/json/json-field-value.js'
import type { JsonField } from './fields/json/json-field.js'
import type { IJsonFieldValue } from './fields/json/json-field.type.js'
import {
  createJsonFieldSchema,
  createJsonFieldValue_internal,
  jsonFieldQuerySchema,
  jsonReadableValueSchema,
  jsonTypeSchema,
  updateJsonFieldSchema,
} from './fields/json/json-field.type.js'
import type { LookupFieldValue } from './fields/lookup/lookup-field-value.js'
import type { LookupField } from './fields/lookup/lookup-field.js'
import type { ILookupField, ILookupFieldValue } from './fields/lookup/lookup-field.type.js'
import {
  createLookupFieldSchema,
  createLookupFieldValue_internal,
  lookupFieldQuerySchema,
  lookupFieldQueryValue,
  lookupTypeSchema,
  updateLookupFieldSchema,
} from './fields/lookup/lookup-field.type.js'
import type { MaxFieldValue } from './fields/max/max-field-value.js'
import type { MaxField } from './fields/max/max-field.js'
import type { IMaxField, IMaxFieldValue } from './fields/max/max-field.type.js'
import {
  createMaxFieldSchema,
  createMaxFieldValue_internal,
  maxFieldQuerySchema,
  maxFieldQueryValue,
  maxTypeSchema,
  updateMaxFieldSchema,
} from './fields/max/max-field.type.js'
import type { MinFieldValue } from './fields/min/min-field-value.js'
import type { MinField } from './fields/min/min-field.js'
import type { IMinField, IMinFieldValue } from './fields/min/min-field.type.js'
import {
  createMinFieldSchema,
  createMinFieldValue_internal,
  minFieldQuerySchema,
  minFieldQueryValue,
  minTypeSchema,
  updateMinFieldSchema,
} from './fields/min/min-field.type.js'
import type { MultiSelectFieldValue } from './fields/multi-select/multi-select-field-value.js'
import type { MultiSelectField } from './fields/multi-select/multi-select-field.js'
import type { IMultiSelectField, IMultiSelectFieldValue } from './fields/multi-select/multi-select-field.type.js'
import {
  createMultiSelectFieldSchema,
  createMultiSelectFieldValue_internal,
  multiSelectFieldQuerySchema,
  multiSelectFieldQueryValue,
  multiSelectTypeSchema,
  updateMultiSelectFieldSchema,
} from './fields/multi-select/multi-select-field.type.js'
import type { NumberFieldValue } from './fields/number/number-field-value.js'
import type { NumberField } from './fields/number/number-field.js'
import type { INumberFieldValue } from './fields/number/number-field.type.js'
import {
  createNumberFieldSchema,
  createNumberFieldValue_internal,
  numberFieldQuerySchema,
  numberFieldQueryValue,
  numberTypeSchema,
  updateNumberFieldSchema,
} from './fields/number/number-field.type.js'
import type { ParentFieldValue } from './fields/parent/parent-field-value.js'
import type { ParentField } from './fields/parent/parent-field.js'
import type { IParentField, IParentFieldValue } from './fields/parent/parent-field.type.js'
import {
  createParentFieldSchema,
  createParentFieldValue_internal,
  parentFieldQuerySchema,
  parentFieldQueryValue,
  parentTypeSchema,
  updateParentFieldSchema,
} from './fields/parent/parent-field.type.js'
import type { QRCodeFieldValue } from './fields/qrcode/qrcode-field-value.js'
import type { QRCodeField } from './fields/qrcode/qrcode-field.js'
import type { IQRCodeFieldValue } from './fields/qrcode/qrcode-field.type.js'
import {
  createQRCodeFieldSchema,
  createQRCodeFieldValue_internal,
  qrcodeFieldQuerySchema,
  qrcodeFieldQueryValue,
  qrcodeTypeSchema,
  updateQRCodeFieldSchema,
} from './fields/qrcode/qrcode-field.type.js'
import type { RatingFieldValue } from './fields/rating/rating-field-value.js'
import type { RatingField } from './fields/rating/rating-field.js'
import type { IRatingFieldValue } from './fields/rating/rating-field.type.js'
import {
  createRatingFieldSchema,
  createRatingFieldValue_internal,
  ratingFieldQuerySchema,
  ratingFieldQueryValue,
  ratingTypeSchema,
  updateRatingFieldSchema,
} from './fields/rating/rating-field.type.js'
import type { ReferenceFieldValue } from './fields/reference/reference-field-value.js'
import type { ReferenceField } from './fields/reference/reference-field.js'
import type { IReferenceField } from './fields/reference/reference-field.type.js'
import {
  createReferenceFieldSchema,
  createReferenceFieldValue_internal,
  referenceFieldQuerySchema,
  referenceFieldQueryValue,
  referenceTypeSchema,
  updateReferenceFieldSchema,
} from './fields/reference/reference-field.type.js'
import type { IReferenceFilterValue } from './fields/reference/reference.filter.js'
import type { SelectFieldValue } from './fields/select/select-field-value.js'
import type { SelectField } from './fields/select/select-field.js'
import type { ISelectField, ISelectFieldValue } from './fields/select/select-field.type.js'
import {
  createSelectFieldSchema,
  createSelectFieldValue_internal,
  selectFieldQuerySchema,
  selectFieldQueryValue,
  selectTypeSchema,
  updateSelectFieldSchema,
} from './fields/select/select-field.type.js'
import type { StringFieldValue } from './fields/string/string-field-value.js'
import type { StringField } from './fields/string/string-field.js'
import type { IStringFieldValue } from './fields/string/string-field.type.js'
import {
  createStringFieldSchema,
  createStringFieldValue_internal,
  stringFieldQuerySchema,
  stringFieldQueryValue,
  stringTypeSchema,
  updateStringFieldSchema,
} from './fields/string/string-field.type.js'
import type { SumFieldValue } from './fields/sum/sum-field-value.js'
import type { SumField } from './fields/sum/sum-field.js'
import type { ISumField, ISumFieldValue } from './fields/sum/sum-field.type.js'
import {
  createSumFieldSchema,
  createSumFieldValue_internal,
  sumFieldQuerySchema,
  sumFieldQueryValue,
  sumTypeSchema,
  updateSumFieldSchema,
} from './fields/sum/sum-field.type.js'
import type { TreeFieldValue } from './fields/tree/tree-field-value.js'
import type { TreeField } from './fields/tree/tree-field.js'
import type { ITreeField, ITreeFieldValue } from './fields/tree/tree-field.type.js'
import {
  createTreeFieldSchema,
  createTreeFieldValue_internal,
  treeFieldQuerySchema,
  treeFieldQueryValue,
  treeTypeSchema,
  updateTreeFieldSchema,
} from './fields/tree/tree-field.type.js'
import type { UpdatedAtFieldValue } from './fields/updated-at/updated-at-field-value.js'
import type { UpdatedAtField } from './fields/updated-at/updated-at-field.js'
import type { IUpdatedAtField, IUpdatedAtFieldValue } from './fields/updated-at/updated-at-field.type.js'
import {
  createUpdatedAtFieldSchema,
  createUpdatedAtFieldValue_internal,
  updateUpdatedAtFieldSchema,
  updatedAtFieldQuerySchema,
  updatedAtFieldQueryValue,
  updatedAtTypeSchema,
} from './fields/updated-at/updated-at-field.type.js'
import type { UpdatedByFieldValue } from './fields/updated-by/updated-by-field-value.js'
import type { UpdatedByField } from './fields/updated-by/updated-by-field.js'
import type { IUpdatedByFieldValue } from './fields/updated-by/updated-by-field.type.js'
import {
  createUpdatedByFieldSchema,
  createUpdatedByFieldValue_internal,
  updateUpdatedByFieldSchema,
  updatedByFieldQuerySchema,
  updatedByFieldQueryValue,
  updatedByTypeSchema,
} from './fields/updated-by/updated-by-field.type.js'
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
import type {
  WithNewOption,
  WithOption,
  WithOptions,
  WithoutOption,
} from './specifications/select-field.specification.js'
import type { FieldDescription } from './value-objects/field-description.js'
import { fieldNameSchema } from './value-objects/field-name.schema.js'
import {
  fieldIdSchema,
  type DateFormat,
  type FieldId,
  type FieldIssue,
  type FieldName,
  type FieldValueConstraints,
  type TimeFormat,
} from './value-objects/index.js'

export const createFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createIdFieldSchema,
  createCreatedAtFieldSchema,
  createUpdatedAtFieldSchema,
  createAutoIncrementFieldSchema,
  createStringFieldSchema,
  createEmailFieldSchema,
  createQRCodeFieldSchema,
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
  createMinFieldSchema,
  createMaxFieldSchema,
])
export type ICreateFieldSchema = z.infer<typeof createFieldSchema>

export const updateFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  updateIdFieldSchema,
  updateCreatedAtFieldSchema,
  updateUpdatedAtFieldSchema,
  updateAutoIncrementFieldSchema,
  updateStringFieldSchema,
  updateEmailFieldSchema,
  updateQRCodeFieldSchema,
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
  updateMinFieldSchema,
  updateMaxFieldSchema,
])
export type IUpdateFieldSchema = z.infer<typeof updateFieldSchema>

export const queryFieldSchema = z.discriminatedUnion(FIELD_TYPE_KEY, [
  idFieldQuerySchema,
  createdAtFieldQuerySchema,
  updatedAtFieldQuerySchema,
  autoIncrementFieldQuerySchema,
  stringFieldQuerySchema,
  emailFieldQuerySchema,
  qrcodeFieldQuerySchema,
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
  minFieldQuerySchema,
  maxFieldQuerySchema,
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
  qrcodeTypeSchema,
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
  minTypeSchema,
  maxTypeSchema,
])
export type IFieldType = z.infer<typeof fieldTypes>

export const createFieldValueSchema_internal = z.discriminatedUnion(FIELD_TYPE_KEY, [
  createIdFieldValue_internal,
  createCreatedAtFieldValue_internal,
  createUpdatedAtFieldValue_internal,
  createAutoIncrementFieldValue_internal,
  createStringFieldValue_internal,
  createEmailFieldValue_internal,
  createQRCodeFieldValue_internal,
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
  createMinFieldValue_internal,
  createMaxFieldValue_internal,
])
export type ICreateFieldValueSchema_internal = z.infer<typeof createFieldValueSchema_internal>

export const createFieldsSchema_internal = z.array(createFieldValueSchema_internal)
export type ICreateFieldsSchema_internal = z.infer<typeof createFieldsSchema_internal>

export interface IBaseFieldQuerySchema {
  id: string
  name: string
  display: boolean
  description?: string
  type: IFieldType
  required: boolean
}

export const baseFieldEventSchema = z.object({
  id: fieldIdSchema,
  name: fieldNameSchema,
  type: fieldTypes,
})

export type IBaseFieldEventSchema = z.infer<typeof baseFieldEventSchema> & { [key in symbol]: any }

export const baseSchemaEventSchema = baseFieldEventSchema.array()
export type IBaseSchemaEventSchema = z.infer<typeof baseSchemaEventSchema>

export interface IBaseField {
  id: FieldId
  system?: boolean
  display?: boolean
  name: FieldName
  description?: FieldDescription
  valueConstrains: FieldValueConstraints
}

export type BaseDateField = { format?: DateFormat; timeFormat?: TimeFormat }

export type SystemField = IdField | CreatedAtField | UpdatedAtField | CreatedByField | UpdatedByField

export type IReferenceFieldTypes = IReferenceField | ITreeField | IParentField
export type ReferenceFieldTypes = ReferenceField | TreeField | ParentField
export type ILookingFieldTypes = IReferenceFieldTypes | ILookupField
export type LookingFieldTypes = ReferenceFieldTypes | LookupField
export type AggregateFieldType = CountField | SumField | MinField | MaxField
export type INumberAggregateFieldType = ISumField | IAverageField | IMinField | IMaxField
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
  | QRCodeField
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
  | MinField
  | MaxField

export type PrimitiveField =
  | StringField
  | NumberField
  | EmailField
  | QRCodeField
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
  | MinField
  | MaxField

export type Field = SystemField | NoneSystemField

export type FieldValue =
  | IdFieldValue
  | CreatedAtFieldValue
  | UpdatedAtFieldValue
  | AutoIncrementFieldValue
  | StringFieldValue
  | EmailFieldValue
  | QRCodeFieldValue
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
  | MinFieldValue
  | MaxFieldValue

export type FieldValues = FieldValue[]

export type UnpackedFieldValue =
  | IIdFieldValue
  | ICreatedAtFieldValue
  | IUpdatedAtFieldValue
  | IAutoIncrementFieldValue
  | IStringFieldValue
  | IEmailFieldValue
  | IQRCodeFieldValue
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
  | IMinFieldValue
  | IMaxFieldValue

export const fieldQueryValueMap: Record<IFieldType, z.ZodTypeAny> = {
  string: stringFieldQueryValue,
  number: numberFieldQueryValue,
  id: idFieldQueryValue,
  'created-at': createdAtFieldQueryValue,
  'updated-at': updatedAtFieldQueryValue,
  'auto-increment': autoIncrementQueryValue,
  color: colorFieldQueryValue,
  email: emailFieldQueryValue,
  qrcode: qrcodeFieldQueryValue,
  url: urlFieldQueryValue,
  json: jsonReadableValueSchema,
  date: dateFieldQueryValue,
  select: selectFieldQueryValue,
  'multi-select': multiSelectFieldQueryValue,
  bool: boolFieldQueryValue,
  'date-range': dateRangeFieldQueryValue,
  reference: referenceFieldQueryValue,
  tree: treeFieldQueryValue,
  parent: parentFieldQueryValue,
  rating: ratingFieldQueryValue,
  currency: currencyFieldQueryValue,
  count: countFieldQueryValue,
  lookup: lookupFieldQueryValue,
  sum: sumFieldQueryValue,
  average: averageFieldQueryValue,
  attachment: attachmentFieldQueryValue,
  collaborator: collaboratorFieldQueryValue,
  'created-by': createdByFieldQueryValue,
  'updated-by': updatedByFieldQueryValue,
  min: minFieldQueryValue,
  max: maxFieldQueryValue,
}

export const fieldQueryValue = z.union([
  treeFieldQueryValue,
  autoIncrementQueryValue,
  boolFieldQueryValue,
  colorFieldQueryValue,
  createdAtFieldQueryValue,
  dateFieldQueryValue,
  dateRangeFieldQueryValue,
  emailFieldQueryValue,
  qrcodeFieldQueryValue,
  urlFieldQueryValue,
  jsonReadableValueSchema,
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
  minFieldQueryValue,
  maxFieldQueryValue,
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

export const lookupFieldType = z.union([
  sumTypeSchema,
  averageTypeSchema,
  countTypeSchema,
  lookupTypeSchema,
  minTypeSchema,
  maxTypeSchema,
])
export type ILookupFieldType = z.infer<typeof lookupFieldType>

export interface IAbstractAggregateField {
  type: IAggregateFieldType
  get aggregateFieldId(): FieldId
  set aggregateFieldId(fieldId: FieldId)
}

export const aggregateFieldType = z.union([sumTypeSchema, averageTypeSchema, minTypeSchema, maxTypeSchema])
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
