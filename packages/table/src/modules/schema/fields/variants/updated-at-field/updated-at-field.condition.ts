import { z } from "@undb/zod"
import { createAbstractDateFieldCondition } from "../abstractions/abstract-date-field.condition"

export const createUpdatedAtFieldCondition = createAbstractDateFieldCondition

export type IUpdatedAtFieldConditionSchema = ReturnType<typeof createUpdatedAtFieldCondition>
export type IUpdatedAtFieldCondition = z.infer<IUpdatedAtFieldConditionSchema>

export type IUpdatedAtFieldConditionOp = IUpdatedAtFieldCondition["op"]
