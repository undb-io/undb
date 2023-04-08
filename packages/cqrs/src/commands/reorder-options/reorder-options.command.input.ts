import { reorderOptionsSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const reorderOptionsCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(reorderOptionsSchema)
