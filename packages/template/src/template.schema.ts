import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { templateExportSchema, templateIdSchema, templateNameSchema } from './value-objects/index.js'

export const templateSchema = z.object({
  id: templateIdSchema,
  name: templateNameSchema,
  export: templateExportSchema,
})

export const templateJsonSchema = zodToJsonSchema(templateIdSchema, 'templateSchema')

export type ITemplateSchema = z.infer<typeof templateSchema>
