import * as z from 'zod'
import { queryRecordSchema } from '../../record/index.js'

export const getParentAvailableRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
