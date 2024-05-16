import { z } from "zod"
import { createAbstractNumberFieldCondition } from "../abstractions"

export const createAutoIncrementFieldCondition = createAbstractNumberFieldCondition

export type IAutoIncrementFieldConditionSchema = ReturnType<typeof createAutoIncrementFieldCondition>
export type IAutoIncrementFieldCondition = z.infer<IAutoIncrementFieldConditionSchema>
