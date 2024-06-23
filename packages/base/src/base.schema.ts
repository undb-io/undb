import { z } from "zod"
import { baseIdSchema, baseNameSchema } from "./value-objects/index.js"

export const queryBase = z.object({
  id: baseIdSchema,
  name: baseNameSchema,
})

export type IQueryBase = z.infer<typeof queryBase>

export const createBaseSchema = z.object({
  id: baseIdSchema.optional(),
  name: baseNameSchema,
})

export type ICreateBaseSchema = z.infer<typeof createBaseSchema>

export const updateBaseSchema = z
  .object({
    name: baseNameSchema,
  })
  .partial()

export type IUpdateBaseSchema = z.infer<typeof updateBaseSchema>
