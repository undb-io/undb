import * as z from 'zod'
import { fieldDescriptionSchema } from './value-objects/field-description.js'
import { fieldIdSchema } from './value-objects/field-id.schema.js'
import { fieldNameSchema } from './value-objects/field-name.schema.js'
import { valueConstraintsSchema } from './value-objects/index.js'

export const createBaseFieldSchema = z
  .object({
    id: fieldIdSchema.optional(),
    name: fieldNameSchema,
    description: fieldDescriptionSchema.optional(),
    display: z.boolean().optional(),
  })
  .merge(valueConstraintsSchema)

export type IBaseCreateFieldSchema = z.infer<typeof createBaseFieldSchema>

export const updateBaseFieldSchema = z
  .object({
    id: fieldIdSchema,
    name: fieldNameSchema,
    description: fieldDescriptionSchema,
    display: z.boolean().optional(),
  })
  .merge(valueConstraintsSchema)
  .partial()

export type IBaseUpdateFieldSchema = z.infer<typeof updateBaseFieldSchema>

export const baseFieldQuerySchema = z
  .object({
    id: fieldIdSchema,
    name: fieldNameSchema,
    description: fieldDescriptionSchema.optional(),
    display: z.boolean(),
  })
  .merge(valueConstraintsSchema)
