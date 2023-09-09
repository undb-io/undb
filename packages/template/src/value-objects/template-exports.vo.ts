import { createFieldSchema, tableIdSchema, tableNameSchema } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const templateTableSchema = z.object({
  id: tableIdSchema,
  name: tableNameSchema,
  schema: createFieldSchema.array(),
})

export const exportSchema = z.object({
  tables: templateTableSchema,
})

export type IExportSchema = z.infer<typeof exportSchema>

export class TemplateExport extends ValueObject<IExportSchema> {}
