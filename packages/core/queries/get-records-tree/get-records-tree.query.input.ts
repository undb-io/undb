import * as z from 'zod'
import { tableIdSchema } from '../../value-objects'
import { viewNameSchema } from '../../view'

export const getRecordsTreeQueryInput = z.object({
  tableId: tableIdSchema,
  viewKey: viewNameSchema.optional(),
})
