import * as z from 'zod'
import { queryRecordSchema } from '../../record/index.js'

export const getTreeAvailableRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
