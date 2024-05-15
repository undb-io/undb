import type { CreatedAtField } from "./variants/created-at-field"
import type { IdField } from "./variants/id-field"
import type { NumberField } from "./variants/number-field/number-field.vo"
import type { StringField } from "./variants/string-field/string-field.vo"

export interface IFieldVisitor {
  id(field: IdField): void
  createdAt(field: CreatedAtField): void
  string(field: StringField): void
  number(field: NumberField): void
}
