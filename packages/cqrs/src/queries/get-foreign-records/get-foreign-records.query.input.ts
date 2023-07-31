import { fieldIdSchema, rootFilter, tableIdSchema, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const getForeignRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  foreignTableId: tableIdSchema,
  fieldId: fieldIdSchema,
  viewId: viewIdSchema.optional(),
  filter: rootFilter.optional(),
  q: z.string().optional(),
})
