import { fieldIdSchema, sortDirection, tableIdSchema, viewIdSchema } from '@egodb/core'
import { z } from 'zod'

export const setFieldSortsCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  fieldId: fieldIdSchema,
  direction: sortDirection,
})
