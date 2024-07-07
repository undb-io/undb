import { z } from "@undb/zod"
import { createBaseConditionSchema } from "../../condition/base.condition"

export function createCheckboxFieldCondition<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseConditionSchema(itemType)
  return z.union([
    // z.object({ op: z.literal("eq"), value: z.string().min(1) }).merge(base),
    // z.object({ op: z.literal("neq"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("is_true"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_false"), value: z.undefined() }).merge(base),
    // TODO: add more conditions
    // for example has key key empty is array etc
  ])
}

export type ICheckboxFieldConditionSchema = ReturnType<typeof createCheckboxFieldCondition>
export type ICheckboxFieldCondition = z.infer<ICheckboxFieldConditionSchema>

export type ICheckboxFieldConditionOp = ICheckboxFieldCondition["op"]
