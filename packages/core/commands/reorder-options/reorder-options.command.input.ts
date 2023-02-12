import { z } from 'zod'
import { reorderOptionsSchema } from '../../field/index.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const reorderOptionsCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(reorderOptionsSchema)
