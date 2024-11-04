import { z } from "@undb/zod"
import { endOfToday, endOfTomorrow, endOfYesterday, startOfToday, startOfTomorrow, startOfYesterday } from "date-fns"
import { match } from "ts-pattern"
import type {
  INotRecordComositeSpecification,
  IRecordComositeSpecification,
} from "../../../../records/record/record.composite-specification"
import type { FieldId } from "../../field-id.vo"
import { createAbstractDateFieldCondition } from "../abstractions/abstract-date-field.condition"
import {
  DateRangeDateIsAfter,
  DateRangeDateIsBefore,
  DateRangeDateIsEmpty,
  DateRangeDateIsSameDay,
  DateRangeDateIsToday,
  DateRangeDateIsTomorrow,
  DateRangeDateIsYesterday,
} from "./date-range-field.specification"

export const dateRangeItemType = z.object({
  scope: z.enum(["start", "end"]),
})

export type IDateRangeFieldConditionItem = z.infer<typeof dateRangeItemType>
export type IDateRangeFieldConditionItemScope = IDateRangeFieldConditionItem["scope"]

export function createDateRangeFieldCondition() {
  return createAbstractDateFieldCondition(dateRangeItemType)
}

export type IDateRangeFieldConditionSchema = ReturnType<typeof createDateRangeFieldCondition>
export type IDateRangeFieldCondition = z.infer<IDateRangeFieldConditionSchema>

export type IDateRangeFieldConditionOp = IDateRangeFieldCondition["op"]

export const createDateRangeConditionMather = (
  condition: z.infer<ReturnType<typeof createDateRangeFieldCondition>>,
  fieldId: FieldId,
) => {
  const scope = condition.option.scope
  return match(condition)
    .returnType<IRecordComositeSpecification | INotRecordComositeSpecification>()
    .with({ op: "is_same_day" }, ({ value }) => new DateRangeDateIsSameDay(new Date(value), fieldId, scope))
    .with({ op: "is_not_same_day" }, ({ value }) => new DateRangeDateIsSameDay(new Date(value), fieldId, scope).not())
    .with({ op: "is_tody" }, () => new DateRangeDateIsToday(fieldId, scope))
    .with({ op: "is_not_today" }, () => new DateRangeDateIsToday(fieldId, scope).not())
    .with({ op: "is_tomorrow" }, () => new DateRangeDateIsTomorrow(fieldId, scope))
    .with({ op: "is_not_tomorrow" }, () => new DateRangeDateIsTomorrow(fieldId, scope).not())
    .with({ op: "is_yesterday" }, () => new DateRangeDateIsYesterday(fieldId, scope))
    .with({ op: "is_not_yesterday" }, () => new DateRangeDateIsYesterday(fieldId, scope).not())
    .with({ op: "is_before" }, ({ value }) => new DateRangeDateIsBefore(new Date(value), fieldId, scope))
    .with({ op: "is_before_today" }, () => new DateRangeDateIsBefore(startOfToday(), fieldId, scope))
    .with({ op: "is_before_tommorow" }, () => new DateRangeDateIsBefore(startOfTomorrow(), fieldId, scope))
    .with({ op: "is_before_yesterday" }, () => new DateRangeDateIsBefore(startOfYesterday(), fieldId, scope))
    .with({ op: "is_not_before" }, ({ value }) => new DateRangeDateIsBefore(new Date(value), fieldId, scope).not())
    .with({ op: "is_after" }, ({ value }) => new DateRangeDateIsAfter(new Date(value), fieldId, scope))
    .with({ op: "is_after_today" }, () => new DateRangeDateIsAfter(endOfToday(), fieldId, scope))
    .with({ op: "is_after_tomorrow" }, () => new DateRangeDateIsAfter(endOfTomorrow(), fieldId, scope))
    .with({ op: "is_after_yesterday" }, () => new DateRangeDateIsAfter(endOfYesterday(), fieldId, scope))
    .with({ op: "is_not_after" }, ({ value }) => new DateRangeDateIsAfter(new Date(value), fieldId, scope).not())
    .with({ op: "is_empty" }, () => new DateRangeDateIsEmpty(fieldId, scope))
    .with({ op: "is_not_empty" }, () => new DateRangeDateIsEmpty(fieldId, scope).not())
}
