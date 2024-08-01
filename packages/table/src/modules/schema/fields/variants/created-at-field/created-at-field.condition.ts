import { z } from "@undb/zod"
import { createAbstractDateFieldCondition } from "../abstractions/abstract-date-field.condition"

export const createCreatedAtFieldCondition = createAbstractDateFieldCondition

export type ICreatedAtFieldConditionSchema = ReturnType<typeof createCreatedAtFieldCondition>
export type ICreatedAtFieldCondition = z.infer<ICreatedAtFieldConditionSchema>

export type ICreatedAtFieldConditionOp = ICreatedAtFieldCondition["op"]
