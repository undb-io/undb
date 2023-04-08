import { tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const setShowSystemFieldssCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  showSystemFields: z.boolean(),
})
