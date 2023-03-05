import { tableIdSchema, updateTableSchema } from '@egodb/core'
import { z } from 'zod'

export const updateTableCommandInput = z
  .object({
    id: tableIdSchema,
  })
  .merge(updateTableSchema)
