import type { BoolFieldValue } from './bool-field-value'
import type { DateFieldValue } from './date-field-value'
import type { DateRangeFieldValue } from './date-range-field-value'
import type { NumberFieldValue } from './number-field-value'
import type { ReferenceFieldValue } from './reference-field-value'
import type { SelectFieldValue } from './select-field-value'
import type { StringFieldValue } from './string-field-value'

export interface IFieldValueVisitor {
  string(value: StringFieldValue): void
  number(value: NumberFieldValue): void
  bool(value: BoolFieldValue): void
  date(value: DateFieldValue): void
  dateRange(value: DateRangeFieldValue): void
  select(value: SelectFieldValue): void
  reference(value: ReferenceFieldValue): void
}
