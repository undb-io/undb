import { sortsSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const setSortsCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  sorts: sortsSchema,
})
