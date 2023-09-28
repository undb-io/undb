import { tableIdSchema, viewIdSchema, viewNameSchema } from '@undb/core'
import * as z from 'zod'

export const duplicateViewCommandInput = z.object({
  tableId: tableIdSchema,
  id: viewIdSchema,
  name: viewNameSchema.optional(),
})
export type IDuplicateViewInput = z.infer<typeof duplicateViewCommandInput>
