import { queryRecordSchema } from '@egodb/core'
import * as z from 'zod'

export const getRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
