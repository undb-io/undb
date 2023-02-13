import { recordIdSchema } from '@egodb/core'
import * as z from 'zod'

export const createRecordCommandOutput = z.object({
  id: recordIdSchema,
})

export type ICreateRecordOutput = z.infer<typeof createRecordCommandOutput>
