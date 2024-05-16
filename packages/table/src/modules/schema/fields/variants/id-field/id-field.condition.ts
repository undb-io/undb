import { z } from "zod"
import { createBaseConditionSchema } from "../../condition"

export function createIdFieldCondition<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseConditionSchema(itemType)
  return z.union([
    z.object({ op: z.literal("eq"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("neq"), value: z.string().min(1) }).merge(base),
  ])
}

export type IIdFieldConditionSchema = ReturnType<typeof createIdFieldCondition>
export type IIdFieldCondition = z.infer<IIdFieldConditionSchema>
