import type { DateIsSameDay } from "./abstract-date-value.specification"

export interface IAbstractDateFieldValueVisitor {
  dateIsSameDate(spec: DateIsSameDay): void
}
