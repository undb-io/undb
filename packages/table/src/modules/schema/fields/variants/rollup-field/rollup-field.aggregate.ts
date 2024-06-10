import { z } from "@undb/zod"

export const rollupFieldAggregate = z.enum([
  //
  "min",
  "max",
  "sum",
])
