import * as z from 'zod'
import { queryTreeRecords } from '../../record/index.js'

export const getRecordsTreeQueryOutput = z.object({
  records: queryTreeRecords,
})
