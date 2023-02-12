import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { sortsSchema, viewNameSchema } from '../../view/index.js'

export const setSortsCommandInput = z.object({
  tableId: tableIdSchema,
  viewKey: viewNameSchema.optional(),
  sorts: sortsSchema,
})
