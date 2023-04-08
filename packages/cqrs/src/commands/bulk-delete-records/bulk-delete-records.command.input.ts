import { recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const bulkDeleteRecordsCommandInput = z.object({
  tableId: tableIdSchema,
  ids: recordIdSchema.array().nonempty(),
})
export type IBulkDeleteRecordsInput = z.infer<typeof bulkDeleteRecordsCommandInput>
