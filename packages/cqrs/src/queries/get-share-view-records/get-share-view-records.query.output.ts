import { queryRecordSchema } from '@undb/core'
import { z } from 'zod'

export const getShareViewRecordsQueryOutput = z.object({
  records: queryRecordSchema.array(),
})
