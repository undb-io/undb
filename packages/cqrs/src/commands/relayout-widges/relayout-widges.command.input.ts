import { relayoutWidgeSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const relayoutWidgesCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  widges: relayoutWidgeSchema.array(),
})
