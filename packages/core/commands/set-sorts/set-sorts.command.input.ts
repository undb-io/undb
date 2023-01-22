import { z } from 'zod'
import { tableIdSchema } from '../../value-objects'
import { sortsSchema, viewNameSchema } from '../../view'

export const setSortsCommandInput = z.object({
  tableId: tableIdSchema,
  viewKey: viewNameSchema.optional(),
  sorts: sortsSchema,
})
