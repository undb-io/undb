import { createTableSchemaSchema, tableIdSchema, tableNameSchema } from '@egodb/core'
import * as z from 'zod'

export const createTableCommandInput = z.object({
  id: tableIdSchema.optional(),
  name: tableNameSchema,
  schema: createTableSchemaSchema,
})
