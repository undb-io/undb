import { createViewSchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const createViewCommandInput = z.object({
  tableId: tableIdSchema,
  view: createViewSchema,
})
