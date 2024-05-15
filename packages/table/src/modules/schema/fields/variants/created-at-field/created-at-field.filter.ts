import { z } from "zod"
import { abstractDateFieldFilter } from "../abstractions/abstract-date-field.filter"

export const createdAtFieldFilter = abstractDateFieldFilter

export type ICreatedAtFieldFilterSchema = typeof createdAtFieldFilter
export type ICreatedAtFieldFilter = z.infer<typeof createdAtFieldFilter>
