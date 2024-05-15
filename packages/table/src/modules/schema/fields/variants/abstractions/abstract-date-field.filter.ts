import { match } from "ts-pattern"
import { z } from "zod"
import { createBaseFilterSchema } from "../../../../filters/base.filter"
import type { FieldId } from "../../field-id.vo"
import { DateIsSameDay, DateIsToday } from "./abstract-date-value.specification"

export function createAbstractDateFieldFilter<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseFilterSchema(itemType)
  return z.union([
    z.object({ op: z.literal("is_same_day"), value: z.string().date() }).merge(base),
    z.object({ op: z.literal("is_not_same_day"), value: z.string().date() }).merge(base),
    z.object({ op: z.literal("is_tody"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_after_today"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_before_today"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_tomorrow"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_after_tomorrow"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_before_tommorow"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_yesterday"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_after_yesterday"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_before_yesterday"), value: z.undefined() }).merge(base),
  ])
}

export const createAbstractDateFilterMather = (
  filter: z.infer<ReturnType<typeof createAbstractDateFieldFilter>>,
  fieldId: FieldId,
) =>
  match(filter)
    .with({ op: "is_same_day" }, ({ value }) => new DateIsSameDay(new Date(value), fieldId))
    .with({ op: "is_not_same_day" }, ({ value }) => new DateIsSameDay(new Date(value), fieldId).not())
    .with({ op: "is_tody" }, ({}) => new DateIsToday(fieldId).not())
