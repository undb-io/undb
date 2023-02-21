import { fieldIdSchema, rootFilter, tableIdSchema, viewIdSchema } from '@egodb/core'
import * as z from 'zod'

export const getForeignRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  foreignTableId: tableIdSchema,
  fieldId: fieldIdSchema,
  viewId: viewIdSchema.optional(),
  filter: rootFilter.optional(),
})
