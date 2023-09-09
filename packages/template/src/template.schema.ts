import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { exportSchema, templateIdSchema, templateNameSchema } from './value-objects/index.js'

export const templateSchema = z.object({
  version: z.number().int().positive(),
  id: templateIdSchema,
  name: templateNameSchema,
  exports: exportSchema.array(),
})

export const templateJsonSchema = zodToJsonSchema(templateIdSchema, 'templateSchema')

export type ITemplateSchema = z.infer<typeof templateSchema>
