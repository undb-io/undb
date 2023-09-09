import { createFieldSchema, tableIdSchema, tableNameSchema } from '@undb/core'
import { z } from 'zod'

export const templateTableSchema = z.object({
  id: tableIdSchema,
  name: tableNameSchema,
  schema: createFieldSchema.array(),
})

export const exportSchema = z.object({
  tables: templateTableSchema,
})

export const templateSchema = z.object({
  version: z.number().int().positive(),
  name: z.string().nonempty(),
  exports: exportSchema.array(),
})
