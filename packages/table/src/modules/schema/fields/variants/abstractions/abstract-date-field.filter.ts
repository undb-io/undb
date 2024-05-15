import { z } from "zod"
import { baseFilter } from "../../../../filters/base.filter"
import { DateIsSameDay } from "./abstract-date-value.specification"
import { match } from "ts-pattern"
import type { FieldId } from "../../field-id.vo"

export const abstractDateFieldFilter = z.union([
  z.object({ op: z.literal("is_same_day"), value: z.string().date() }).merge(baseFilter),
  z.object({ op: z.literal("is_not_same_day"), value: z.string().date() }).merge(baseFilter),
  z.object({ op: z.literal("is_tody"), value: z.undefined() }).merge(baseFilter),
  z.object({ op: z.literal("is_after_today"), value: z.undefined() }).merge(baseFilter),
  z.object({ op: z.literal("is_before_today"), value: z.undefined() }).merge(baseFilter),
  z.object({ op: z.literal("is_tomorrow"), value: z.undefined() }).merge(baseFilter),
  z.object({ op: z.literal("is_after_tomorrow"), value: z.undefined() }).merge(baseFilter),
  z.object({ op: z.literal("is_before_tommorow"), value: z.undefined() }).merge(baseFilter),
  z.object({ op: z.literal("is_yesterday"), value: z.undefined() }).merge(baseFilter),
  z.object({ op: z.literal("is_after_yesterday"), value: z.undefined() }).merge(baseFilter),
  z.object({ op: z.literal("is_before_yesterday"), value: z.undefined() }).merge(baseFilter),
])

export const createAbstractDateFilterMather = (filter: z.infer<typeof abstractDateFieldFilter>, fieldId: FieldId) =>
  match(filter)
    .with({ op: "is_same_day" }, ({ value }) => new DateIsSameDay(new Date(value), fieldId))
    .with({ op: "is_not_same_day" }, ({ value }) => new DateIsSameDay(new Date(value), fieldId).not())
