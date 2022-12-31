import { z } from 'zod'
import { reorderOptionsSchema } from '../../field'
import { tableIdSchema } from '../../value-objects'

export const reorderOptionsCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(reorderOptionsSchema)
