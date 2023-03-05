import { tableIdSchema, viewIdSchema } from '@egodb/core'
import * as z from 'zod'

export const duplicateViewCommandInput = z.object({
  tableId: tableIdSchema,
  id: viewIdSchema,
})
export type IDuplicateViewInput = z.infer<typeof duplicateViewCommandInput>
