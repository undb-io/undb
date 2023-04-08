import { fieldIdSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const resetFieldSortsCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  fieldId: fieldIdSchema,
})
