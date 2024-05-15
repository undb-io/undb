import { z } from "zod"
import { baseFilter } from "../../../../filters/base.filter"

export const stringFieldFilter = z.union([
  z.object({ op: z.literal("eq"), value: z.string().min(1) }).merge(baseFilter),
  z.object({ op: z.literal("neq"), value: z.string().min(1) }).merge(baseFilter),
  z.object({ op: z.literal("contains"), value: z.string().min(1) }).merge(baseFilter),
  z.object({ op: z.literal("does_not_contain"), value: z.string().min(1) }).merge(baseFilter),
  z.object({ op: z.literal("starts_with"), value: z.string().min(1) }).merge(baseFilter),
  z.object({ op: z.literal("ends_with"), value: z.string().min(1) }).merge(baseFilter),
  z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(baseFilter),
  z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(baseFilter),
])

export type IStringFieldFilterSchema = typeof stringFieldFilter
export type IStringFieldFilter = z.infer<typeof stringFieldFilter>
