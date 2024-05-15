import { z } from "zod"
import { abstractNumberFieldFilter } from "../abstractions"

export const autoIncrementFieldFilter = abstractNumberFieldFilter

export type IAutoIncrementFieldFilterSchema = typeof autoIncrementFieldFilter
export type IAutoIncrementFieldFilter = z.infer<typeof autoIncrementFieldFilter>
