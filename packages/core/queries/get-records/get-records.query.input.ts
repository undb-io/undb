import * as z from 'zod'
import { tableIdSchema } from '../../value-objects'

export const getRecordsQueryInput = z.object({
  tableId: tableIdSchema,
})
