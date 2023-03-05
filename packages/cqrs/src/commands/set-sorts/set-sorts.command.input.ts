import { sortsSchema, tableIdSchema, viewIdSchema } from '@egodb/core'
import { z } from 'zod'

export const setSortsCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  sorts: sortsSchema,
})
