import { queryTreeRecords } from '@egodb/core'
import * as z from 'zod'

export const getRecordsTreeQueryOutput = z.object({
  records: queryTreeRecords,
})
