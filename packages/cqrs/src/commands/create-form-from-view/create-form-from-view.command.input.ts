import { createFormBaseSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const createFormFromViewCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  form: createFormBaseSchema.partial(),
})
