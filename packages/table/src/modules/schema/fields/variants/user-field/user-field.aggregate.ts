import { z } from "@undb/zod"

export const userFieldAggregate = z.enum([
  //
  "count_empty",
  "count_not_empty",
  "percent_empty",
  "percent_not_empty",
])
