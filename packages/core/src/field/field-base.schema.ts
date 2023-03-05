import * as z from 'zod'
import { fieldIdSchema } from './value-objects/field-id.schema.js'
import { fieldNameSchema } from './value-objects/field-name.schema.js'
import { valueConstraintsSchema } from './value-objects/index.js'

export const createBaseFieldsSchema = z
  .object({
    id: fieldIdSchema.optional(),
    name: fieldNameSchema,
  })
  .merge(valueConstraintsSchema)

export type IBaseCreateFieldsSchema = z.infer<typeof createBaseFieldsSchema>

export const updateBaseFieldSchema = z
  .object({
    name: fieldNameSchema,
  })
  .partial()

export type IBaseUpdateFieldSchema = z.infer<typeof updateBaseFieldSchema>

export const baseFieldQuerySchema = z.object({ id: fieldIdSchema, name: fieldNameSchema }).merge(valueConstraintsSchema)
