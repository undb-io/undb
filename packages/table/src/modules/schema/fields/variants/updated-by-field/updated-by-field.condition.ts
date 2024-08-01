import { z } from "@undb/zod"
import { createAbstractUserFieldCondition } from "../abstractions"

export const createUpdatedByFieldCondition = createAbstractUserFieldCondition

export type IUpdatedByFieldConditionSchema = ReturnType<typeof createUpdatedByFieldCondition>
export type IUpdatedByFieldCondition = z.infer<IUpdatedByFieldConditionSchema>

export type IUpdatedByFieldConditionOp = IUpdatedByFieldCondition["op"]
