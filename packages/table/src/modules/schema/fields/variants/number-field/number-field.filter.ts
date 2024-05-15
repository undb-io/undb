import { z } from "zod"
import { abstractNumberFieldFilter } from "../abstractions/abstract-number-field.filter"

export const numberFieldFilter = abstractNumberFieldFilter

export type INumberFieldFilterSchema = typeof numberFieldFilter
export type INumberFieldFilter = z.infer<typeof numberFieldFilter>
