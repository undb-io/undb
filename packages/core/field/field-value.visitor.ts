import type { AutoIncrementFieldValue } from './auto-increment-field-value'
import type { BoolFieldValue } from './bool-field-value'
import type { CreatedAtFieldValue } from './created-at-field-value'
import type { DateFieldValue } from './date-field-value'
import type { DateRangeFieldValue } from './date-range-field-value'
import type { EmailFieldValue } from './email-field-value'
import type { IdFieldValue } from './id-field-value'
import type { NumberFieldValue } from './number-field-value'
import type { ParentFieldValue } from './parent-field-value'
import type { ReferenceFieldValue } from './reference-field-value'
import type { SelectFieldValue } from './select-field-value'
import type { StringFieldValue } from './string-field-value'
import type { TreeFieldValue } from './tree-field-value'
import type { UpdatedAtFieldValue } from './updated-at-field-value'

export interface IFieldValueVisitor {
  id(value: IdFieldValue): void
  createdAt(value: CreatedAtFieldValue): void
  updatedAt(value: UpdatedAtFieldValue): void
  autoIncrement(value: AutoIncrementFieldValue): void
  string(value: StringFieldValue): void
  email(value: EmailFieldValue): void
  number(value: NumberFieldValue): void
  bool(value: BoolFieldValue): void
  date(value: DateFieldValue): void
  dateRange(value: DateRangeFieldValue): void
  select(value: SelectFieldValue): void
  reference(value: ReferenceFieldValue): void
  tree(value: TreeFieldValue): void
  parent(value: ParentFieldValue): void
}
