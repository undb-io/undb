import { createViewSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const createViewCommandInput = z.object({
  tableId: tableIdSchema,
  view: createViewSchema,
})
