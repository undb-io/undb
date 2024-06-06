import type {
  IStringFieldConstraint,
  REFERENCE_TYPE,
  ReferenceField,
  ReferenceFieldValue,
  UPDATED_AT_TYPE,
  UPDATED_BY_TYPE,
  UpdatedAtField,
  UpdatedAtFieldValue,
  UpdatedByField,
  UpdatedByFieldValue,
} from ".."
import type { AUTO_INCREMENT_TYPE, AutoIncrementField, AutoIncrementFieldValue } from "./variants/autoincrement-field"
import type { CREATED_AT_TYPE, CreatedAtField, CreatedAtFieldValue } from "./variants/created-at-field"
import type { CREATED_BY_TYPE, CreatedByField, CreatedByFieldValue } from "./variants/created-by-field"
import type { ID_TYPE, IdField, IdFieldValue } from "./variants/id-field"
import type { INumberFieldConstraint } from "./variants/number-field/number-field-constraint.vo"
import type { NumberFieldValue } from "./variants/number-field/number-field-value.vo"
import type { NUMBER_TYPE, NumberField } from "./variants/number-field/number-field.vo"
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

export type MutableFieldValue = StringFieldValue | NumberFieldValue | ReferenceFieldValue

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

export type NoneSystemFieldType = Exclude<
  FieldType,
  | typeof ID_TYPE
  | typeof CREATED_AT_TYPE
  | typeof AUTO_INCREMENT_TYPE
  | typeof UPDATED_AT_TYPE
  | typeof CREATED_BY_TYPE
  | typeof UPDATED_BY_TYPE
>

export type SystemFieldType = Exclude<FieldType, NoneSystemFieldType>

export type IFieldConstraint = IStringFieldConstraint | INumberFieldConstraint
