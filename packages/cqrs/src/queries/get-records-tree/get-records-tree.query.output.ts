import { queryTreeRecords } from '@undb/core'
import * as z from 'zod'

export const getRecordsTreeQueryOutput = z.object({
  records: queryTreeRecords,
})
