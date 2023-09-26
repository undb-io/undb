import {
  baseIdSchema,
  createTableSchemaSchema,
  fieldIdSchema,
  tableEmojiSchema,
  tableIdSchema,
  tableNameSchema,
} from '@undb/core'
import * as z from 'zod'

export const createTableCommandInput = z.object({
  id: tableIdSchema.optional(),
  baseId: baseIdSchema.optional(),
  name: tableNameSchema,
  emoji: tableEmojiSchema.optional(),
  schema: createTableSchemaSchema,
  records: z.record(fieldIdSchema, z.any()).array().optional(),
})
