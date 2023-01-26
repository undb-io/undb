import * as z from 'zod'
import { queryRecordSchema } from '../../record'

export const getParentAvailableRecordsQueryOutput = z.object({
  records: z.array(queryRecordSchema),
})
