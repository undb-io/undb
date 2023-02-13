import { mutateRecordValueSchema, recordIdSchema, tableIdSchema } from '@egodb/core'
import * as z from 'zod'

export const createRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema.optional(),
  value: mutateRecordValueSchema,
})
export type ICreateRecordInput = z.infer<typeof createRecordCommandInput>
