import type { ReferenceField, UpdatedAtField, UpdatedByField } from ".."
import type { AutoIncrementField } from "./variants/autoincrement-field"
import type { CreatedAtField } from "./variants/created-at-field"
import type { CreatedByField } from "./variants/created-by-field"
import type { IdField } from "./variants/id-field"
import type { NumberField } from "./variants/number-field/number-field.vo"
import type { RollupField } from "./variants/rollup-field"
import type { StringField } from "./variants/string-field/string-field.vo"

export interface IFieldVisitor {
  id(field: IdField): void
  autoIncrement(field: AutoIncrementField): void
  createdAt(field: CreatedAtField): void
  createdBy(field: CreatedByField): void
  updatedAt(field: UpdatedAtField): void
  updatedBy(field: UpdatedByField): void
  string(field: StringField): void
  number(field: NumberField): void

  reference(field: ReferenceField): void
  rollup(field: RollupField): void
}
