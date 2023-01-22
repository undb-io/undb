import type { BoolField } from './bool-field'
import type { DateField } from './date-field'
import type { DateRangeField } from './date-range-field'
import type { IdField } from './id-field'
import type { NumberField } from './number-field'
import type { ReferenceField } from './reference-field'
import type { SelectField } from './select-field'
import type { StringField } from './string-field'
import type { TreeField } from './tree-field'

export interface IFieldVisitor {
  id(value: IdField): void
  string(value: StringField): void
  number(value: NumberField): void
  bool(value: BoolField): void
  date(value: DateField): void
  dateRange(value: DateRangeField): void
  select(value: SelectField): void
  reference(value: ReferenceField): void
  tree(value: TreeField): void
}
