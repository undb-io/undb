import { trashRecordSchema } from '@undb/core'
import * as z from 'zod'

export const getTrashRecordsQueryOutput = z.object({
  records: z.array(trashRecordSchema),
  total: z.number().nonnegative().int(),
})
