import * as z from 'zod'
import { mutateRecordValueSchema } from '../../record/record.schema.js'
import { recordIdSchema } from '../../record/value-objects/record-id.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const createRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema.optional(),
  value: mutateRecordValueSchema,
})
export type ICreateRecordInput = z.infer<typeof createRecordCommandInput>
