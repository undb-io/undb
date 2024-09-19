import { z } from "@undb/zod"
import { createBaseConditionSchema } from "../../condition/base.condition"

export function createDurationFieldCondition<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseConditionSchema(itemType)
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

export type IDurationFieldConditionSchema = ReturnType<typeof createDurationFieldCondition>
export type IDurationFieldCondition = z.infer<IDurationFieldConditionSchema>

export type IDurationFieldConditionOp = IDurationFieldCondition["op"]
