import * as z from 'zod'
import { recordIdSchema } from '../../record/value-objects/record-id.schema'

export const createRecordCommandOutput = z.object({
  id: recordIdSchema,
})

export type ICreateRecordOutput = z.infer<typeof createRecordCommandOutput>
