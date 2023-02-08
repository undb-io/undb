import * as z from 'zod'
import { recordIdSchema } from '../../record/value-objects/record-id.schema'
import { tableIdSchema } from '../../value-objects'

export const bulkDeleteRecordsCommandInput = z.object({
  tableId: tableIdSchema,
  ids: recordIdSchema.array().nonempty(),
})
export type IBulkDeleteRecordsInput = z.infer<typeof bulkDeleteRecordsCommandInput>
