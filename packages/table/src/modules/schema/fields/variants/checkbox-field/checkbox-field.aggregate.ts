import { z } from "@undb/zod"

export const checkboxFieldAggregate = z.enum([
  //
  "count_true",
  "count_false",
  "percent_true",
  "percent_false",
])
