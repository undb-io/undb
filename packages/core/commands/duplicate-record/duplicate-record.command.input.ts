import * as z from 'zod'
import { recordIdSchema } from '../../record/value-objects/record-id.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const duplicateRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema,
})
export type IDuplicateRecordInput = z.infer<typeof duplicateRecordCommandInput>
