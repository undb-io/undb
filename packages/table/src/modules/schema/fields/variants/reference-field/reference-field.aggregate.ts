import { z } from "@undb/zod"

export const referenceFieldAggregate = z.enum([
  //
  "count_empty",
  "count_not_empty",
])
