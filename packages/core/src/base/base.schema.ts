import { z } from 'zod'
import { baseIdSchema, baseNameSchema } from './value-objects'

export const queryBase = z.object({
  id: baseIdSchema,
  name: baseNameSchema,
})

export type IQueryBase = z.infer<typeof queryBase>

export const createBaseSchema = z.object({
  name: baseNameSchema,
})

export type ICreateBaseSchema = z.infer<typeof createBaseSchema>
