import { z } from "@undb/zod"
import { createBaseConditionSchema } from "../../condition/base.condition"

export function createJsonFieldCondition<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseConditionSchema(itemType)
  return z.union([
    z.object({ op: z.literal("eq"), value: z.any() }).merge(base),
    z.object({ op: z.literal("neq"), value: z.any() }).merge(base),
    z.object({ op: z.literal("contains"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("does_not_contain"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
  ])
}

export type IJsonFieldConditionSchema = ReturnType<typeof createJsonFieldCondition>
export type IJsonFieldCondition = z.infer<IJsonFieldConditionSchema>

export type IJsonFieldConditionOp = IJsonFieldCondition["op"]
