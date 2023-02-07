import * as z from 'zod'
import { recordIdSchema } from '../../record/value-objects/record-id.schema'
import { tableIdSchema } from '../../value-objects'

export const bulkDeleteRecordCommandInput = z.object({
  tableId: tableIdSchema,
  ids: recordIdSchema.array().nonempty(),
})
export type IBulkDeleteRecordInput = z.infer<typeof bulkDeleteRecordCommandInput>
