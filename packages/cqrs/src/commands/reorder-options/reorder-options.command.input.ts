import { reorderOptionsSchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const reorderOptionsCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(reorderOptionsSchema)
