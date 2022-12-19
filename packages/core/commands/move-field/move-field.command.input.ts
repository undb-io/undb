import { z } from 'zod'
import { tableIdSchema } from '../../value-objects'
import { moveFieldSchema } from '../../view'

export const moveFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(moveFieldSchema)
