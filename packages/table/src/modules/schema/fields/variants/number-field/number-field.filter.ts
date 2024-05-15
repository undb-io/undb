import { z } from "zod"
import { createAbstractNumberFieldFilter } from "../abstractions/abstract-number-field.filter"

export const createNumberFieldFilter = createAbstractNumberFieldFilter

export type INumberFieldFilterSchema = ReturnType<typeof createNumberFieldFilter>
export type INumberFieldFilter = z.infer<INumberFieldFilterSchema>
