import * as z from 'zod'
import { mutateRecordValueSchema } from '../../record/record.schema'
import { recordIdSchema } from '../../record/value-objects/record-id.vo'
import { tableIdSchema } from '../../value-objects'

export const updateRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema.optional(),
  value: mutateRecordValueSchema,
})
export type IUpdateRecordCommandInput = z.infer<typeof updateRecordCommandInput>
