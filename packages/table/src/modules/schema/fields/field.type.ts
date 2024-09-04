import type { z } from "@undb/zod"
import type {
  BUTTON_TYPE,
  ButtonField,
  ButtonFieldValue,
  DATE_TYPE,
  DateField,
  DateFieldValue,
  IButtonFieldOption,
  IDateFieldConditionSchema,
  IDateFieldConstraint,
  IJsonFieldConditionSchema,
  IJsonFieldConstraint,
  INumberFieldConditionSchema,
  IReferenceFieldConstraint,
  IReferenceFieldOption,
  IRollupFieldConditionSchema,
  IRollupFieldOption,
  IStringFieldConditionSchema,
  IStringFieldConstraint,
  IUpdatedAtFieldConditionSchema,
  IUpdatedByFieldConditionSchema,
  IUrlFieldConditionSchema,
  IUrlFieldConstraint,
  JSON_TYPE,
  JsonField,
  JsonFieldValue,
  REFERENCE_TYPE,
  ROLLUP_TYPE,
  ReferenceField,
  ReferenceFieldValue,
  RollupField,
  RollupFieldValue,
  UPDATED_AT_TYPE,
  UPDATED_BY_TYPE,
  URL_TYPE,
  UpdatedAtField,
  UpdatedAtFieldValue,
  UpdatedByField,
  UpdatedByFieldValue,
  UrlField,
  UrlFieldValue,
} from ".."
import type {
  ATTACHMENT_TYPE,
  AttachmentField,
  AttachmentFieldValue,
  IAttachmentFieldConditionSchema,
  IAttachmentFieldConstraint,
} from "./variants/attachment-field"
import type {
  AUTO_INCREMENT_TYPE,
  AutoIncrementField,
  AutoIncrementFieldValue,
  IAutoIncrementFieldConditionSchema,
} from "./variants/autoincrement-field"
import type {
  CHECKBOX_TYPE,
  CheckboxField,
  CheckboxFieldValue,
  ICheckboxFieldConditionSchema,
  ICheckboxFieldConstraint,
} from "./variants/checkbox-field"
import type {
  CREATED_AT_TYPE,
  CreatedAtField,
  CreatedAtFieldValue,
  ICreatedAtFieldConditionSchema,
} from "./variants/created-at-field"
import type {
  CREATED_BY_TYPE,
  CreatedByField,
  CreatedByFieldValue,
  ICreatedByFieldConditionSchema,
} from "./variants/created-by-field"
import type {
  CURRENCY_TYPE,
  CurrencyField,
  CurrencyFieldValue,
  ICurrencyFieldConditionSchema,
  ICurrencyFieldConstraint,
  ICurrencyFieldOption,
} from "./variants/currency-field"
import type {
  DURATION_TYPE,
  DurationField,
  DurationFieldValue,
  IDurationFieldConditionSchema,
  IDurationFieldConstraint,
} from "./variants/duration-field"
import type {
  EMAIL_TYPE,
  EmailField,
  EmailFieldValue,
  IEmailFieldConditionSchema,
  IEmailFieldConstraint,
} from "./variants/email-field"
import type { ID_TYPE, IIdFieldConditionSchema, IdField, IdFieldValue } from "./variants/id-field"
import {
  LONGTEXT_TYPE,
  LongTextField,
  LongTextFieldValue,
  type ILongTextFieldConditionSchema,
  type ILongTextFieldConstraint,
} from "./variants/long-text-field"
import type { INumberFieldConstraint } from "./variants/number-field/number-field-constraint.vo"
import type { NumberFieldValue } from "./variants/number-field/number-field-value.vo"
import type { NUMBER_TYPE, NumberField } from "./variants/number-field/number-field.vo"
import type {
  IPercentageFieldConditionSchema,
  IPercentageFieldConstraint,
  PERCENTAGE_TYPE,
  PercentageField,
  PercentageFieldValue,
} from "./variants/percentage-field"
import type {
  IRatingFieldConditionSchema,
  IRatingFieldConstraint,
  RATING_TYPE,
  RatingField,
  RatingFieldValue,
} from "./variants/rating-field"
import type {
  ISelectFieldConditionSchema,
  ISelectFieldConstraint,
  ISelectFieldOption,
  SELECT_TYPE,
  SelectField,
  SelectFieldValue,
} from "./variants/select-field"
import type { StringFieldValue } from "./variants/string-field/string-field-value.vo"
import type { STRING_TYPE, StringField } from "./variants/string-field/string-field.vo"
import type {
  IUserFieldConditionSchema,
  IUserFieldConstraint,
  USER_TYPE,
  UserField,
  UserFieldValue,
} from "./variants/user-field"
import type { IUserFieldMacro } from "./variants/user-field/user-field-macro"

export type Field =
  | StringField
  | NumberField
  | IdField
  | CreatedAtField
  | AutoIncrementField
  | UpdatedAtField
  | CreatedByField
  | UpdatedByField
  | ReferenceField
  | RollupField
  | SelectField
  | RatingField
  | EmailField
  | UrlField
  | AttachmentField
  | DateField
  | JsonField
  | CheckboxField
  | UserField
  | LongTextField
  | CurrencyField
  | ButtonField
  | DurationField
  | PercentageField

export type SystemField =
  | IdField
  | AutoIncrementField
  | UpdatedAtField
  | UpdatedByField
  | CreatedAtField
  | CreatedByField

export type NoneSystemField = Exclude<Field, SystemField>

export type FieldValue =
  | StringFieldValue
  | NumberFieldValue
  | IdFieldValue
  | CreatedAtFieldValue
  | AutoIncrementFieldValue
  | UpdatedAtFieldValue
  | CreatedByFieldValue
  | UpdatedByFieldValue
  | ReferenceFieldValue
  | RollupFieldValue
  | SelectFieldValue
  | RatingFieldValue
  | EmailFieldValue
  | UrlFieldValue
  | AttachmentFieldValue
  | DateFieldValue
  | JsonFieldValue
  | CheckboxFieldValue
  | UserFieldValue
  | LongTextFieldValue
  | CurrencyFieldValue
  | ButtonFieldValue
  | DurationFieldValue
  | PercentageFieldValue

export type MutableFieldValue =
  | StringFieldValue
  | NumberFieldValue
  | ReferenceFieldValue
  | SelectFieldValue
  | RatingFieldValue
  | EmailFieldValue
  | UrlFieldValue
  | AttachmentFieldValue
  | DateFieldValue
  | JsonFieldValue
  | CheckboxFieldValue
  | UserFieldValue
  | LongTextFieldValue
  | CurrencyFieldValue
  | DurationFieldValue
  | PercentageFieldValue

export type FieldType =
  | typeof STRING_TYPE
  | typeof NUMBER_TYPE
  | typeof ID_TYPE
  | typeof CREATED_AT_TYPE
  | typeof AUTO_INCREMENT_TYPE
  | typeof UPDATED_AT_TYPE
  | typeof CREATED_BY_TYPE
  | typeof UPDATED_BY_TYPE
  | typeof REFERENCE_TYPE
  | typeof ROLLUP_TYPE
  | typeof SELECT_TYPE
  | typeof RATING_TYPE
  | typeof EMAIL_TYPE
  | typeof URL_TYPE
  | typeof ATTACHMENT_TYPE
  | typeof DATE_TYPE
  | typeof JSON_TYPE
  | typeof CHECKBOX_TYPE
  | typeof USER_TYPE
  | typeof LONGTEXT_TYPE
  | typeof CURRENCY_TYPE
  | typeof BUTTON_TYPE
  | typeof DURATION_TYPE
  | typeof PERCENTAGE_TYPE

export type NoneSystemFieldType = Exclude<
  FieldType,
  | typeof ID_TYPE
  | typeof CREATED_AT_TYPE
  | typeof AUTO_INCREMENT_TYPE
  | typeof UPDATED_AT_TYPE
  | typeof CREATED_BY_TYPE
  | typeof UPDATED_BY_TYPE
>

export type IFieldConditionSchema =
  | IIdFieldConditionSchema
  | IStringFieldConditionSchema
  | INumberFieldConditionSchema
  | ICreatedAtFieldConditionSchema
  | ICreatedByFieldConditionSchema
  | IUpdatedByFieldConditionSchema
  | IUpdatedAtFieldConditionSchema
  | IAutoIncrementFieldConditionSchema
  | IRollupFieldConditionSchema
  | ISelectFieldConditionSchema
  | IRatingFieldConditionSchema
  | IEmailFieldConditionSchema
  | IUrlFieldConditionSchema
  | IAttachmentFieldConditionSchema
  | IDateFieldConditionSchema
  | IJsonFieldConditionSchema
  | ICheckboxFieldConditionSchema
  | IUserFieldConditionSchema
  | ILongTextFieldConditionSchema
  | ICurrencyFieldConditionSchema
  | IDurationFieldConditionSchema
  | IPercentageFieldConditionSchema
  | z.ZodUnion<any>

export type SystemFieldType = Exclude<FieldType, NoneSystemFieldType>

export type IFilterableFieldType = Exclude<FieldType, "reference" | "rollup" | "attachment" | "button">

export type IFieldConstraint =
  | IStringFieldConstraint
  | INumberFieldConstraint
  | IReferenceFieldConstraint
  | ISelectFieldConstraint
  | IRatingFieldConstraint
  | IEmailFieldConstraint
  | IUrlFieldConstraint
  | IAttachmentFieldConstraint
  | IDateFieldConstraint
  | IJsonFieldConstraint
  | ICheckboxFieldConstraint
  | IUserFieldConstraint
  | ILongTextFieldConstraint
  | ICurrencyFieldConstraint
  | IDurationFieldConstraint
  | IPercentageFieldConstraint

export type IFieldOption =
  | IReferenceFieldOption
  | IRollupFieldOption
  | ISelectFieldOption
  | IButtonFieldOption
  | ICurrencyFieldOption

export type IFieldMacro = IUserFieldMacro
