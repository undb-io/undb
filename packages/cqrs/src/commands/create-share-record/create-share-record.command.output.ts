import { recordIdSchema } from '@undb/core'
import * as z from 'zod'

export const createShareRecordCommandOutput = z.object({
  id: recordIdSchema,
})

export type ICreateShareRecordOutput = z.infer<typeof createShareRecordCommandOutput>
