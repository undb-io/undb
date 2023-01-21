import { z } from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema'

export const sortDirection = z.enum(['asc', 'desc'])

export type ISortDirection = z.infer<typeof sortDirection>

export const sortsSchema = z.record(fieldIdSchema, sortDirection)

export type ISorts = z.infer<typeof sortsSchema>
