import { z } from "@undb/zod"

export const abstractNumberAggregate = z.enum([
  //
  "min",
  "max",
  "count_empty",
  "count_not_empty",
  "count_uniq",
])
