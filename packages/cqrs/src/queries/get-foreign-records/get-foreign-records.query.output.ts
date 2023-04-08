import { queryRecordSchema } from '@undb/core'
import * as z from 'zod'

export const getForeignRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
