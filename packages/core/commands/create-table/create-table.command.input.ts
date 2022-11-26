import * as z from 'zod'
import { createTableSchemaSchema, tableNameSchema } from '../../value-objects'

export const createTableCommandInput = z.object({
  name: tableNameSchema,
  schema: createTableSchemaSchema,
})
