import { fieldIdSchema, recordIdSchema, tableIdSchema, viewIdSchema } from '@egodb/core'
import * as z from 'zod'

export const getTreeAvailableRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  treeFieldId: fieldIdSchema,
  recordId: recordIdSchema.optional(),
  viewId: viewIdSchema.optional(),
})
