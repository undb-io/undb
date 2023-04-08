import { moveFieldSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const moveFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(moveFieldSchema)
