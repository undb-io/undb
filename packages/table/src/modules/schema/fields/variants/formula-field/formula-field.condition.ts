import type { ReturnType as FormulaReturnType } from "@undb/formula"
import { z } from "@undb/zod"
import { createBaseConditionSchema } from "../../condition/base.condition"

export function createFormulaFieldCondition<ItemType extends z.ZodTypeAny>(returnType: FormulaReturnType) {
  return function (itemType: ItemType) {
    const base = createBaseConditionSchema(itemType)
    if (returnType === "number") {
      return z.union([
        z.object({ op: z.literal("eq"), value: z.number() }).merge(base),
        z.object({ op: z.literal("neq"), value: z.number() }).merge(base),
        z.object({ op: z.literal("gt"), value: z.number() }).merge(base),
        z.object({ op: z.literal("gte"), value: z.number() }).merge(base),
        z.object({ op: z.literal("lt"), value: z.number() }).merge(base),
        z.object({ op: z.literal("lte"), value: z.number() }).merge(base),
        z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
        z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
      ])
    }
    else if (returnType === "boolean") {
      return z.union([
        z.object({ op: z.literal("is_true"), value: z.undefined() }).merge(base),
        z.object({ op: z.literal("is_false"), value: z.undefined() }).merge(base),
      ])
    }
    return z.union([
        z.object({ op: z.literal("eq"), value: z.boolean() }).merge(base),
      z.object({ op: z.literal("neq"), value: z.number() }).merge(base),
      z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
      z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
    ])
  }
}

export type IFormulaFieldConditionSchema = ReturnType<ReturnType<typeof createFormulaFieldCondition>>
export type IFormulaFieldCondition = z.infer<IFormulaFieldConditionSchema>

export type IFormulaFieldConditionOp = IFormulaFieldCondition["op"]
