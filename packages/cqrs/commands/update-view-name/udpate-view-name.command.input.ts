import { tableIdSchema, updateViewNameSchema } from '@egodb/core'
import { z } from 'zod'

export const updateViewNameCommandInput = z.object({
  tableId: tableIdSchema,
  view: updateViewNameSchema,
})
