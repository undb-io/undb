import type {
  DateIsAfter,
  DateIsBefore,
  DateIsSameDay,
  DateIsToday,
  DateIsTomorrow,
} from "./abstract-date-value.specification"

export interface IAbstractDateFieldValueVisitor {
  dateIsSameDate(spec: DateIsSameDay): void
  dateIsToday(spec: DateIsToday): void
  dateIsTomorrow(spec: DateIsTomorrow): void
  dateIsYesterday(spec: DateIsTomorrow): void
  dateIsBefore(spec: DateIsBefore): void
  dateIsAfter(spec: DateIsAfter): void
}
