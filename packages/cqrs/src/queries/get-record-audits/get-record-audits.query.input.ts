import { recordIdSchema } from '@undb/core'
import * as z from 'zod'

export const getRecordAuditsQueryInput = z.object({
  recordId: recordIdSchema,
})
