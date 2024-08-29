import { z } from "@undb/zod"

export const currencyFieldAggregate = z.enum([
  //
  "count_empty",
  "count_uniq",
  "count_not_empty",
  "percent_empty",
  "percent_not_empty",
  "percent_uniq",
])
