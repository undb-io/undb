import { moveFieldSchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const moveFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(moveFieldSchema)
