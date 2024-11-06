import { z } from "@undb/zod"
import { endOfToday } from "date-fns/endOfToday"
import { endOfTomorrow } from "date-fns/endOfTomorrow"
import { endOfYesterday } from "date-fns/endOfYesterday"
import { startOfToday } from "date-fns/startOfToday"
import { startOfTomorrow } from "date-fns/startOfTomorrow"
import { startOfYesterday } from "date-fns/startOfYesterday"
import { match } from "ts-pattern"
import { createBaseConditionSchema } from "../../condition/base.condition"
import type { FieldId } from "../../field-id.vo"
import {
  DateIsAfter,
  DateIsBefore,
  DateIsEmpty,
  DateIsSameDay,
  DateIsToday,
  DateIsTomorrow,
  DateIsYesterday,
} from "./abstract-date-value.specification"

type DateMacrosPattern = `@${string}`
export const dateMacros = z.enum<DateMacrosPattern, [DateMacrosPattern, ...DateMacrosPattern[]]>([
  "@now",
  "@todayStart",
  "@todayEnd",
  "@tomorrowStart",
  "@tomorrowEnd",
  "@yesterdayStart",
  "@yesterdayEnd",
])

export type IDateMacros = z.infer<typeof dateMacros>

const dateValue = z.string().or(dateMacros)

export function createAbstractDateFieldCondition<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseConditionSchema(itemType)
  return z.union([
    z.object({ op: z.literal("is_same_day"), value: z.string().date() }).merge(base),
    z.object({ op: z.literal("is_not_same_day"), value: z.string().date() }).merge(base),
    z.object({ op: z.literal("is_tody"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_today"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_after_today"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_before_today"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_tomorrow"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_tomorrow"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_after_tomorrow"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_before_tommorow"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_yesterday"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_yesterday"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_after_yesterday"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_before_yesterday"), value: z.undefined() }).merge(base),

    z.object({ op: z.literal("is_before"), value: dateValue }).merge(base),
    z.object({ op: z.literal("is_not_before"), value: dateValue }).merge(base),
    z.object({ op: z.literal("is_after"), value: dateValue }).merge(base),
    z.object({ op: z.literal("is_not_after"), value: dateValue }).merge(base),

    z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
  ])
}

export const createAbstractDateConditionMather = (
  condition: z.infer<ReturnType<typeof createAbstractDateFieldCondition>>,
  fieldId: FieldId,
) =>
  match(condition)
    .with({ op: "is_same_day" }, ({ value }) => new DateIsSameDay(new Date(value), fieldId))
    .with({ op: "is_not_same_day" }, ({ value }) => new DateIsSameDay(new Date(value), fieldId).not())
    .with({ op: "is_tody" }, () => new DateIsToday(fieldId))
    .with({ op: "is_not_today" }, () => new DateIsToday(fieldId).not())
    .with({ op: "is_tomorrow" }, () => new DateIsTomorrow(fieldId))
    .with({ op: "is_not_tomorrow" }, () => new DateIsTomorrow(fieldId).not())
    .with({ op: "is_yesterday" }, () => new DateIsYesterday(fieldId))
    .with({ op: "is_not_yesterday" }, () => new DateIsYesterday(fieldId).not())
    .with({ op: "is_before" }, ({ value }) => new DateIsBefore(new Date(value), fieldId))
    .with({ op: "is_before_today" }, () => new DateIsBefore(startOfToday(), fieldId))
    .with({ op: "is_before_tommorow" }, () => new DateIsBefore(startOfTomorrow(), fieldId))
    .with({ op: "is_before_yesterday" }, () => new DateIsBefore(startOfYesterday(), fieldId))
    .with({ op: "is_not_before" }, ({ value }) => new DateIsBefore(new Date(value), fieldId).not())
    .with({ op: "is_after" }, ({ value }) => new DateIsAfter(new Date(value), fieldId))
    .with({ op: "is_after_today" }, () => new DateIsAfter(endOfToday(), fieldId))
    .with({ op: "is_after_tomorrow" }, () => new DateIsAfter(endOfTomorrow(), fieldId))
    .with({ op: "is_after_yesterday" }, () => new DateIsAfter(endOfYesterday(), fieldId))
    .with({ op: "is_not_after" }, ({ value }) => new DateIsAfter(new Date(value), fieldId).not())
    .with({ op: "is_empty" }, () => new DateIsEmpty(fieldId))
    .with({ op: "is_not_empty" }, () => new DateIsEmpty(fieldId).not())
