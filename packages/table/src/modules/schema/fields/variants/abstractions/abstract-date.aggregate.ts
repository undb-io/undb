import { z } from "@undb/zod"

export const abstractDateAggregate = z.enum([
  //
  "min",
  "max",
  "count",
  "count_empty",
  "count_not_empty",
  "count_uniq",
])
