import { tableIdSchema, updateViewNameSchema } from '@undb/core'
import { z } from 'zod'

export const updateViewNameCommandInput = z.object({
  tableId: tableIdSchema,
  view: updateViewNameSchema,
})
