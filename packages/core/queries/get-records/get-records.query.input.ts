import * as z from 'zod'
import { tableIdSchema } from '../../value-objects'
import { viewNameSchema } from '../../view'

export const getRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  viewName: viewNameSchema.optional(),
})
