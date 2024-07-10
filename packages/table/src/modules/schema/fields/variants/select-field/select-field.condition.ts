import { z } from "@undb/zod"
import { createBaseConditionSchema } from "../../condition/base.condition"
import { optionId } from "../../option/option-id.vo"

export function createSelectFieldCondition<OptionType extends z.ZodTypeAny>(optionType: OptionType) {
  const base = createBaseConditionSchema(optionType)
  return z.union([
    z.object({ op: z.literal("eq"), value: optionId.or(optionId.array().nonempty()) }).merge(base),
    z.object({ op: z.literal("neq"), value: optionId.or(optionId.array().nonempty()) }).merge(base),
    z.object({ op: z.literal("any_of"), value: optionId.array().nonempty() }).merge(base),
    z.object({ op: z.literal("not_any_of"), value: optionId.array().nonempty() }).merge(base),
    z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
  ])
}

export type ISelectFieldConditionSchema = ReturnType<typeof createSelectFieldCondition>
export type ISelectFieldCondition = z.infer<ISelectFieldConditionSchema>

export type ISelectFieldConditionOp = ISelectFieldCondition["op"]
