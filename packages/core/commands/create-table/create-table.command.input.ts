import * as z from 'zod'
import { createTableSchemaSchema, tableIdSchema, tableNameSchema } from '../../value-objects/index.js'

export const createTableCommandInput = z.object({
  id: tableIdSchema.optional(),
  name: tableNameSchema,
  schema: createTableSchemaSchema,
})
