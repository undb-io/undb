import type {
  DATE_TYPE,
  DateField,
  DateFieldValue,
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
  UpdatedAtField,
  UpdatedAtFieldValue,
  UpdatedByField,
  UpdatedByFieldValue,
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
  EMAIL_TYPE,
  EmailField,
  EmailFieldValue,
  IEmailFieldConditionSchema,
  IEmailFieldConstraint,
} from "./variants/email-field"
import type { ID_TYPE, IIdFieldConditionSchema, IdField, IdFieldValue } from "./variants/id-field"
import type { INumberFieldConstraint } from "./variants/number-field/number-field-constraint.vo"
import type { NumberFieldValue } from "./variants/number-field/number-field-value.vo"
import type { NUMBER_TYPE, NumberField } from "./variants/number-field/number-field.vo"
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
  | AttachmentField
  | DateField
  | JsonField
  | CheckboxField

export type NoneSystemField = Field & { isSystem: false }
export type SystemField = Field & { isSystem: true }

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
  | AttachmentFieldValue
  | DateFieldValue
  | JsonFieldValue
  | CheckboxFieldValue

export type MutableFieldValue =
  | StringFieldValue
  | NumberFieldValue
  | ReferenceFieldValue
  | SelectFieldValue
  | RatingFieldValue
  | EmailFieldValue
  | AttachmentFieldValue
  | DateFieldValue
  | JsonFieldValue
  | CheckboxFieldValue

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
  | typeof ATTACHMENT_TYPE
  | typeof DATE_TYPE
  | typeof JSON_TYPE
  | typeof CHECKBOX_TYPE

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
  | IAttachmentFieldConditionSchema
  | IDateFieldConditionSchema
  | IJsonFieldConditionSchema
  | ICheckboxFieldConditionSchema

export type SystemFieldType = Exclude<FieldType, NoneSystemFieldType>

export type IFieldConstraint =
  | IStringFieldConstraint
  | INumberFieldConstraint
  | IReferenceFieldConstraint
  | ISelectFieldConstraint
  | IRatingFieldConstraint
  | IEmailFieldConstraint
  | IAttachmentFieldConstraint
  | IDateFieldConstraint
  | IJsonFieldConstraint
  | ICheckboxFieldConstraint

export type IFieldOption = IReferenceFieldOption | IRollupFieldOption | ISelectFieldOption
