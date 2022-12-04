import * as z from 'zod'
import { queryRecordSchema } from '../../record'

export const getRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
