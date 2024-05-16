import { z } from "zod"
import { createAbstractDateFieldCondition } from "../abstractions/abstract-date-field.condition"

export const createCreatedAtFieldCondition = createAbstractDateFieldCondition

export type ICreatedAtFieldConditionSchema = ReturnType<typeof createCreatedAtFieldCondition>
export type ICreatedAtFieldCondition = z.infer<ICreatedAtFieldConditionSchema>
