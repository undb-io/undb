import { fieldIdSchema, tableIdSchema, viewIdSchema } from '@egodb/core'
import * as z from 'zod'

export const getForeignRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  fieldId: fieldIdSchema,
})
