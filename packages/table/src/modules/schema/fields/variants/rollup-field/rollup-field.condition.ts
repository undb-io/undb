import { z } from "@undb/zod"
import { createAbstractNumberFieldCondition } from "../abstractions"

export const createRollupFieldCondition = createAbstractNumberFieldCondition

export type IRollupFieldConditionSchema = ReturnType<typeof createRollupFieldCondition>
export type IRollupFieldCondition = z.infer<IRollupFieldConditionSchema>
