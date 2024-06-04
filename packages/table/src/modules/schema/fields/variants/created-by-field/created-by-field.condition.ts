import { z } from "@undb/zod"
import { createAbstractDateFieldCondition } from "../abstractions/abstract-date-field.condition"

export const createCreatedByFieldCondition = createAbstractDateFieldCondition

export type ICreatedByFieldConditionSchema = ReturnType<typeof createCreatedByFieldCondition>
export type ICreatedByFieldCondition = z.infer<ICreatedByFieldConditionSchema>
