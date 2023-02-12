import { z } from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'

export const sortDirection = z.enum(['asc', 'desc'])

export type ISortDirection = z.infer<typeof sortDirection>

export const sortSchema = z.object({
  fieldId: fieldIdSchema,
  direction: sortDirection,
})

export type ISortSchema = z.infer<typeof sortSchema>

export const sortsSchema = z.array(sortSchema)

export type ISorts = z.infer<typeof sortsSchema>
