import * as z from 'zod'
import { queryTreeRecords } from '../../record'

export const getRecordsTreeQueryOutput = z.object({
  records: queryTreeRecords,
})
