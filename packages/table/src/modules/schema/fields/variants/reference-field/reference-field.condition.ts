import { z } from "@undb/zod"
import { createAbstractNumberFieldCondition } from "../abstractions"

export const createReferenceFieldCondition = createAbstractNumberFieldCondition

export type IReferenceFieldConditionSchema = ReturnType<typeof createReferenceFieldCondition>
export type IReferenceFieldCondition = z.infer<IReferenceFieldConditionSchema>
