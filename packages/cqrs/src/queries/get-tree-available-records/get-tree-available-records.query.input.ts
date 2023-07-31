import { fieldIdSchema, recordIdSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const getTreeAvailableRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  treeFieldId: fieldIdSchema,
  recordId: recordIdSchema.optional(),
  viewId: viewIdSchema.optional(),
  q: z.string().optional(),
})
