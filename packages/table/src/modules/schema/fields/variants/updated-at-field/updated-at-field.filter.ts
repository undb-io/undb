import { z } from "zod"
import { abstractDateFieldFilter } from "../abstractions/abstract-date-field.filter"

export const updatedAtFieldFilter = abstractDateFieldFilter

export type IUpdatedAtFieldFilterSchema = typeof updatedAtFieldFilter
export type IUpdatedAtFieldFilter = z.infer<typeof updatedAtFieldFilter>
