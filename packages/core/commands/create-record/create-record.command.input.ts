import * as z from 'zod'
import { createFieldValueSchema, fieldNameSchema } from '../../field'
import { recordIdSchema } from '../../record/value-objects/record-id.vo'
import { tableIdSchema } from '../../value-objects'

export const createRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema.optional(),
  value: z.record(fieldNameSchema, createFieldValueSchema),
})
export type ICreateRecordInput = z.infer<typeof createRecordCommandInput>
