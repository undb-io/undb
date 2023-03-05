import { queryRecordSchema } from '@egodb/core'
import * as z from 'zod'

export const getTreeAvailableRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
