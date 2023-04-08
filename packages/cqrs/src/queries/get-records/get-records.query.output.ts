import { queryRecordSchema } from '@undb/core'
import * as z from 'zod'

export const getRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
  total: z.number().nonnegative().int(),
})
