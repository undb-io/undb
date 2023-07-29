import { fieldIdSchema, recordIdSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const getParentAvailableRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  parentFieldId: fieldIdSchema,
  recordId: recordIdSchema.optional(),
  viewId: viewIdSchema.optional(),
  q: z.string().optional(),
})
