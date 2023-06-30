import { queryTreeRecords } from '@undb/core'
import { z } from 'zod'

export const getShareViewTreeRecordsQueryOutput = z.object({
  records: queryTreeRecords,
})
