import { z } from "zod"
import { baseFilter } from "../../../../filters/base.filter"

export const createdAtFieldFilter = z.union([
  z
    .object({
      op: z.literal("is_same_day"),
      value: z.date(),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal("is_not_same_day"),
      value: z.date(),
    })
    .merge(baseFilter),
])

export type ICreatedAtFieldFilterSchema = typeof createdAtFieldFilter
export type ICreatedAtFieldFilter = z.infer<typeof createdAtFieldFilter>
