import { createWidgeSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const createWidgeCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  widge: createWidgeSchema,
})
