import { z } from "@undb/zod"
import { createAbstractNumberFieldCondition } from "../abstractions/abstract-number-field.condition"

export const createAutoIncrementFieldCondition = createAbstractNumberFieldCondition

export type IAutoIncrementFieldConditionSchema = ReturnType<typeof createAutoIncrementFieldCondition>
export type IAutoIncrementFieldCondition = z.infer<IAutoIncrementFieldConditionSchema>

export type IAutoIncrementFieldConditionOp = IAutoIncrementFieldCondition["op"]
