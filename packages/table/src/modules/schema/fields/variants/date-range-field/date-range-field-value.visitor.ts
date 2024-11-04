import type {
  DateRangeDateIsAfter,
  DateRangeDateIsBefore,
  DateRangeDateIsEmpty,
  DateRangeDateIsSameDay,
  DateRangeDateIsToday,
  DateRangeDateIsTomorrow,
  DateRangeDateIsYesterday,
  DateRangeEqual,
  DateRangeIsEmpty,
} from "./date-range-field.specification"

export interface IDateRangeFieldValueVisitor {
  dateRangeEqual(spec: DateRangeEqual): void
  dateRangeIsEmpty(spec: DateRangeIsEmpty): void
  dateRangeDateIsSameDay(spec: DateRangeDateIsSameDay): void
  dateRangeDateIsToday(spec: DateRangeDateIsToday): void
  dateRangeDateIsTomorrow(spec: DateRangeDateIsTomorrow): void
  dateRangeDateIsYesterday(spec: DateRangeDateIsYesterday): void
  dateRangeDateIsBefore(spec: DateRangeDateIsBefore): void
  dateRangeDateIsAfter(spec: DateRangeDateIsAfter): void
  dateRangeDateIsEmpty(spec: DateRangeDateIsEmpty): void
}
