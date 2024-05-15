import { z } from "zod"
import { baseFilter } from "../../../../filters"

export const abstractNumberFieldFilter = z.union([
  z
    .object({
      op: z.literal("eq"),
      value: z.number(),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal("neq"),
      value: z.number(),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal("gt"),
      value: z.number(),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal("gte"),
      value: z.number(),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal("lt"),
      value: z.number(),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal("lte"),
      value: z.number(),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal("is_empty"),
      value: z.undefined(),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal("is_not_empty"),
      value: z.undefined(),
    })
    .merge(baseFilter),
])
