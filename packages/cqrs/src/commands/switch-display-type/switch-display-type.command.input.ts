import { switchDisplayTypeSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const switchDisplayTypeCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(switchDisplayTypeSchema)
