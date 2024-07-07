import { z } from "@undb/zod"
import { createAbstractNumberFieldCondition } from "../abstractions/abstract-number-field.condition"

export const createNumberFieldCondition = createAbstractNumberFieldCondition

export type INumberFieldConditionSchema = ReturnType<typeof createNumberFieldCondition>
export type INumberFieldCondition = z.infer<INumberFieldConditionSchema>

export type INumberFieldConditionOp = INumberFieldCondition["op"]
