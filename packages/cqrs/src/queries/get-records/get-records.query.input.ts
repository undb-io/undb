import { rootFilter, tableIdSchema, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const getRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  filter: rootFilter.optional(),
  q: z.string().nonempty().optional(),
})
