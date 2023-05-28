import { duplicateFieldSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const duplicateFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(duplicateFieldSchema)

export type IDuplicateFieldInput = z.infer<typeof duplicateFieldCommandInput>
