import { match } from "ts-pattern"
import { z } from "zod"
import { createBaseConditionSchema } from "../../condition/base.condition"
import type { FieldId } from "../../field-id.vo"
import { DateIsSameDay, DateIsToday, DateIsTomorrow, DateIsYesterday } from "./abstract-date-value.specification"

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
