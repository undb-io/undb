import { recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const deleteRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema,
})
export type IDeleteRecordInput = z.infer<typeof deleteRecordCommandInput>
