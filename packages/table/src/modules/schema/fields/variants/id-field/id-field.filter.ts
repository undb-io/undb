import { z } from "zod"
import { baseFilter } from "../../../../filters/base.filter"

export const idFieldFilter = z.union([
  z
    .object({
      op: z.literal("eq"),
      value: z.string().min(1),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal("neq"),
      value: z.string().min(1),
    })
    .merge(baseFilter),
])

export type IIdFieldFilterSchema = typeof idFieldFilter
export type IIdFieldFilter = z.infer<typeof idFieldFilter>
