import type { DateIsSameDay, DateIsToday, DateIsTomorrow } from "./abstract-date-value.specification"

export interface IAbstractDateFieldValueVisitor {
  dateIsSameDate(spec: DateIsSameDay): void
  dateIsToday(spec: DateIsToday): void
  dateIsTomorrow(spec: DateIsTomorrow): void
  dateIsYesterday(spec: DateIsTomorrow): void
}
