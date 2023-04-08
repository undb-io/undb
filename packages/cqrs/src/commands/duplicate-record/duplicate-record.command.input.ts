import { recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const duplicateRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema,
})
export type IDuplicateRecordInput = z.infer<typeof duplicateRecordCommandInput>
