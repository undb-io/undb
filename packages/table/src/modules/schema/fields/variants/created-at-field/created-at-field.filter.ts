import { z } from "zod"
import { createAbstractDateFieldFilter } from "../abstractions/abstract-date-field.filter"

export const createCreatedAtFieldFilter = createAbstractDateFieldFilter

export type ICreatedAtFieldFilterSchema = ReturnType<typeof createCreatedAtFieldFilter>
export type ICreatedAtFieldFilter = z.infer<ICreatedAtFieldFilterSchema>
