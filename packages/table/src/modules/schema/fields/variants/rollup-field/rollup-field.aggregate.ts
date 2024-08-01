import { z } from "@undb/zod"

export const rollupFieldAggregate = z.enum([
  //
  "min",
  "max",
  "sum",
  "avg",
])

export const lookupFieldAggregate = z.enum([
  //
  "count_empty",
  "count_not_empty",
])
