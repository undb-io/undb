import { z } from "@undb/zod"
import { createAbstractDateFieldCondition } from "../abstractions/abstract-date-field.condition"

export const createDateFieldCondition = createAbstractDateFieldCondition

export type IDateFieldConditionSchema = ReturnType<typeof createDateFieldCondition>
export type IDateFieldCondition = z.infer<IDateFieldConditionSchema>

export type IDateFieldConditionOp = IDateFieldCondition["op"]
