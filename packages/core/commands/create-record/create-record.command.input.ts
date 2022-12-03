import * as z from 'zod'
import { recordIdSchema } from '../../record/value-objects/record-id.vo'

export const createRecordCommandInput = z.object({
  id: recordIdSchema.optional(),
})

export type ICreateRecordInput = z.infer<typeof createRecordCommandInput>
