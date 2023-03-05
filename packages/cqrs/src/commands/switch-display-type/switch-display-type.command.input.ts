import { switchDisplayTypeSchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const switchDisplayTypeCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(switchDisplayTypeSchema)
