import type { ReturnType } from "@undb/formula"
import { z } from "@undb/zod"

export const createFormulaFieldAggregate = (returnType: ReturnType) => {
  if (returnType === "boolean") {
    return z.enum(["count_true", "count_false"])
  } else if (returnType === "number") {
    return z.enum([
      "sum",
      "avg",
      "min",
      "max",
      "count_empty",
      "count_uniq",
      "count_not_empty",
      "percent_empty",
      "percent_not_empty",
      "percent_uniq",
    ])
  }

  return z.enum(["count_empty", "count_uniq", "count_not_empty", "percent_empty", "percent_not_empty", "percent_uniq"])
}
