import { queryRecordSchema } from '@undb/core'
import * as z from 'zod'

export const getParentAvailableRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
