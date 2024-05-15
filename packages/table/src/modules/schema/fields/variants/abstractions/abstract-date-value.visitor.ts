import type { DateIsSameDay, DateIsToday } from "./abstract-date-value.specification"

export interface IAbstractDateFieldValueVisitor {
  dateIsSameDate(spec: DateIsSameDay): void
  dateIsToday(spec: DateIsToday): void
}
