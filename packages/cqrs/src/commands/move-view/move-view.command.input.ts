import { moveViewSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const moveViewCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(moveViewSchema)
