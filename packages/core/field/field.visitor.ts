import type { AutoIncrementField } from './auto-increment-field'
import type { BoolField } from './bool-field'
import type { ColorField } from './color-field'
import type { CreatedAtField } from './created-at-field'
import type { DateField } from './date-field'
import type { DateRangeField } from './date-range-field'
import type { EmailField } from './email-field'
import type { IdField } from './id-field'
import type { NumberField } from './number-field'
import type { ParentField } from './parent-field'
import type { ReferenceField } from './reference-field'
import type { SelectField } from './select-field'
import type { StringField } from './string-field'
import type { TreeField } from './tree-field'
import type { UpdatedAtField } from './updated-at-field'

export interface IFieldVisitor {
  id(field: IdField): void
  createdAt(field: CreatedAtField): void
  updatedAt(field: UpdatedAtField): void
  autoIncrement(field: AutoIncrementField): void
  string(field: StringField): void
  email(field: EmailField): void
  color(field: ColorField): void
  number(field: NumberField): void
  bool(field: BoolField): void
  date(field: DateField): void
  dateRange(field: DateRangeField): void
  select(field: SelectField): void
  reference(field: ReferenceField): void
  tree(field: TreeField): void
  parent(field: ParentField): void
}
