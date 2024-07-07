import { z } from "@undb/zod"
import { createBaseConditionSchema } from "../../condition/base.condition"

export function createUserFieldCondition<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseConditionSchema(itemType)
  return z.union([
    z.object({ op: z.literal("eq"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("neq"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
    // TODO: add more conditions
    // for example has key key empty is array etc
  ])
}

export type IUserFieldConditionSchema = ReturnType<typeof createUserFieldCondition>
export type IUserFieldCondition = z.infer<IUserFieldConditionSchema>

export type IUserFieldConditionOp = IUserFieldCondition["op"]
