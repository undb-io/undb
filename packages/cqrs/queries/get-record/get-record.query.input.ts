import { recordIdSchema, tableIdSchema } from '@egodb/core'
import * as z from 'zod'

export const getRecordQueryInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema,
})
