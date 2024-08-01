import { z } from "@undb/zod"
import { createBaseConditionSchema } from "../../condition/base.condition"

export function createStringFieldCondition<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseConditionSchema(itemType)
  return z.union([
    z.object({ op: z.literal("eq"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("neq"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("contains"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("does_not_contain"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("starts_with"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("ends_with"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("min"), value: z.number().int().positive() }).merge(base),
    z.object({ op: z.literal("max"), value: z.number().int().positive() }).merge(base),
  ])
}

export type IStringFieldConditionSchema = ReturnType<typeof createStringFieldCondition>
export type IStringFieldCondition = z.infer<IStringFieldConditionSchema>

export type IStringFieldConditionOp = IStringFieldCondition["op"]
