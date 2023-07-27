import { recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const restoreRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema,
})
export type IRestoreRecordInput = z.infer<typeof restoreRecordCommandInput>
