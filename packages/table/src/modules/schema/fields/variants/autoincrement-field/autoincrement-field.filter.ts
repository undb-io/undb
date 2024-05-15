import { z } from "zod"
import { createAbstractNumberFieldFilter } from "../abstractions"

export const createAutoIncrementFieldFilter = createAbstractNumberFieldFilter

export type IAutoIncrementFieldFilterSchema = ReturnType<typeof createAutoIncrementFieldFilter>
export type IAutoIncrementFieldFilter = z.infer<IAutoIncrementFieldFilterSchema>
