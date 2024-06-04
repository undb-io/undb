import { z } from "@undb/zod"

export const abstractUserAggregate = z.enum([
  //
  "count_empty",
  "count_not_empty",
  "count_uniq",
  "percent_empty",
  "percent_not_empty",
  "percent_uniq",
])
