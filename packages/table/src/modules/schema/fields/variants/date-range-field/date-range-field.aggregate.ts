import { z } from "@undb/zod"

export const dateRangeFieldAggregate = z.enum([
  //
  "count",
  "count_empty",
  "count_not_empty",
  "start_max",
  "end_max",
  "start_min",
  "end_min",
])
