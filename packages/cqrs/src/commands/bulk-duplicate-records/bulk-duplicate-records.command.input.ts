import { recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const bulkDuplicateRecordsCommandInput = z.object({
  tableId: tableIdSchema,
  ids: recordIdSchema.array().nonempty(),
})
export type IBulkDuplicateRecordsInput = z.infer<typeof bulkDuplicateRecordsCommandInput>
