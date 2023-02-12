import * as z from 'zod'
import { recordIdSchema } from '../../record/value-objects/record-id.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const bulkDeleteRecordsCommandInput = z.object({
  tableId: tableIdSchema,
  ids: recordIdSchema.array().nonempty(),
})
export type IBulkDeleteRecordsInput = z.infer<typeof bulkDeleteRecordsCommandInput>
