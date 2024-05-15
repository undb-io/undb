import type { UPDATED_AT_TYPE, UpdatedAtField, UpdatedAtFieldValue } from ".."
import { AUTO_INCREMENT_TYPE, AutoIncrementField, AutoIncrementFieldValue } from "./variants/autoincrement-field"
import type { CREATED_AT_TYPE, CreatedAtField, CreatedAtFieldValue } from "./variants/created-at-field"
import type { ID_TYPE, IdField, IdFieldValue } from "./variants/id-field"
import type { NumberFieldValue } from "./variants/number-field/number-field-value.vo"
import type { NUMBER_TYPE, NumberField } from "./variants/number-field/number-field.vo"
import type { StringFieldValue } from "./variants/string-field/string-field-value.vo"
import type { STRING_TYPE, StringField } from "./variants/string-field/string-field.vo"

export type Field = StringField | NumberField | IdField | CreatedAtField | AutoIncrementField | UpdatedAtField

export type NoneSystemField = Field & { isSystem: false }
export type SystemField = Field & { isSystem: true }

export type FieldValue =
  | StringFieldValue
  | NumberFieldValue
  | IdFieldValue
  | CreatedAtFieldValue
  | AutoIncrementFieldValue
  | UpdatedAtFieldValue

export type FieldType =
  | typeof STRING_TYPE
  | typeof NUMBER_TYPE
  | typeof ID_TYPE
  | typeof CREATED_AT_TYPE
  | typeof AUTO_INCREMENT_TYPE
  | typeof UPDATED_AT_TYPE
