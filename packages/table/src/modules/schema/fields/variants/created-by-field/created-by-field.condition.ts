import { z } from "@undb/zod"
import { createAbstractUserFieldCondition } from "../abstractions"

export const createCreatedByFieldCondition = createAbstractUserFieldCondition

export type ICreatedByFieldConditionSchema = ReturnType<typeof createCreatedByFieldCondition>
export type ICreatedByFieldCondition = z.infer<ICreatedByFieldConditionSchema>

export type ICreatedByFieldConditionOp = ICreatedByFieldCondition["op"]
