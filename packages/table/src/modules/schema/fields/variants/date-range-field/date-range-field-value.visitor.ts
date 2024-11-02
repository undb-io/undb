import type { DateRangeEqual, DateRangeIsEmpty } from "./date-range-field.specification"

export interface IDateRangeFieldValueVisitor {
  dateRangeEqual(spec: DateRangeEqual): void
  dateRangeIsEmpty(spec: DateRangeIsEmpty): void
}
