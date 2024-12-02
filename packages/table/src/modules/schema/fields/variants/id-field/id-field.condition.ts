import { z } from "@undb/zod"
import { createBaseConditionSchema } from "../../condition/base.condition"

export function createIdFieldCondition<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseConditionSchema(itemType)
  return z.union([
    z.object({ op: z.literal("eq"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("neq"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("in"), value: z.string().min(1).array() }).merge(base),
    z.object({ op: z.literal("nin"), value: z.string().min(1).array() }).merge(base),
  ])
}

export type IIdFieldConditionSchema = ReturnType<typeof createIdFieldCondition>
export type IIdFieldCondition = z.infer<IIdFieldConditionSchema>

export type IIdFieldConditionOp = IIdFieldCondition["op"]
