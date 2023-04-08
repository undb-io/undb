import { recordIdSchema } from '@undb/core'
import * as z from 'zod'

export const createRecordCommandOutput = z.object({
  id: recordIdSchema,
})

export type ICreateRecordOutput = z.infer<typeof createRecordCommandOutput>
