import { z } from "@undb/zod"

export const jsonFieldAggregate = z.enum([
  //
  "count_empty",
  "count_not_empty",
  "percent_empty",
  "percent_not_empty",
])
