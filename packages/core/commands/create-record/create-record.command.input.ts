import * as z from 'zod'
import { mutateRecordValueSchema } from '../../record/record.schema'
import { recordIdSchema } from '../../record/value-objects/record-id.vo'
import { tableIdSchema } from '../../value-objects'

export const createRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema.optional(),
  value: mutateRecordValueSchema,
})
export type ICreateRecordInput = z.infer<typeof createRecordCommandInput>
