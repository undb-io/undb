import { z } from "@undb/zod"

export const abstractNumberAggregate = z.enum([
  //
  "sum",
  "avg",
  "min",
  "max",
  "count_empty",
  "count_not_empty",
  "count_uniq",
  "percent_empty",
  "percent_not_empty",
  "percent_uniq",
])
