import * as z from 'zod'
import { recordIdSchema } from '../../record/value-objects/record-id.vo'
import { tableIdSchema } from '../../value-objects'

export const deleteRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema,
})
export type IDeleteRecordInput = z.infer<typeof deleteRecordCommandInput>
