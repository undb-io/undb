import { z } from "@undb/zod"
import { createAbstractDateFieldCondition } from "../abstractions/abstract-date-field.condition"

export const createDateRangeFieldCondition = createAbstractDateFieldCondition

export type IDateRangeFieldConditionSchema = ReturnType<typeof createDateRangeFieldCondition>
export type IDateRangeFieldCondition = z.infer<IDateRangeFieldConditionSchema>

export type IDateRangeFieldConditionOp = IDateRangeFieldCondition["op"]
