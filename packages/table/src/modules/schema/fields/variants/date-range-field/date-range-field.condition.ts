import { z } from "@undb/zod"
import { createAbstractDateRangeFieldCondition } from "../abstractions/abstract-daterange-field.condition"

export const createDateRangeFieldCondition = createAbstractDateRangeFieldCondition

export type IDateRangeFieldConditionSchema = ReturnType<typeof createDateRangeFieldCondition>
export type IDateRangeFieldCondition = z.infer<IDateRangeFieldConditionSchema>

export type IDateRangeFieldConditionOp = IDateRangeFieldCondition["op"]
