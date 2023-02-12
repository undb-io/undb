import * as z from 'zod'
import { queryRecordSchema } from '../../record/index.js'

export const getRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
