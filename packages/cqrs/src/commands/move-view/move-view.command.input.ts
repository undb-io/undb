import { moveViewSchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const moveViewCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(moveViewSchema)
