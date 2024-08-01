import { z } from "@undb/zod"
import { createAbstractNumberFieldCondition } from "../abstractions/abstract-number-field.condition"

export const createRatingFieldCondition = createAbstractNumberFieldCondition

export type IRatingFieldConditionSchema = ReturnType<typeof createRatingFieldCondition>
export type IRatingFieldCondition = z.infer<IRatingFieldConditionSchema>
export type IRatingFieldConditionOp = IRatingFieldCondition["op"]
