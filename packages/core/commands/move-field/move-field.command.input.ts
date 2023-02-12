import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { moveFieldSchema } from '../../view/index.js'

export const moveFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(moveFieldSchema)
