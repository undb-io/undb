import * as z from 'zod'
import { queryRecordSchema } from '../../record'

export const getTreeAvailableRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
