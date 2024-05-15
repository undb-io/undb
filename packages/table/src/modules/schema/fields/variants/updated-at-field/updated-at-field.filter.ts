import { z } from "zod"
import { createAbstractDateFieldFilter } from "../abstractions/abstract-date-field.filter"

export const createUpdatedAtFieldFilter = createAbstractDateFieldFilter

export type IUpdatedAtFieldFilterSchema = ReturnType<typeof createUpdatedAtFieldFilter>
export type IUpdatedAtFieldFilter = z.infer<IUpdatedAtFieldFilterSchema>
