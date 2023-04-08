import { tableIdSchema, updateTableSchema } from '@undb/core'
import { z } from 'zod'

export const updateTableCommandInput = z
  .object({
    id: tableIdSchema,
  })
  .merge(updateTableSchema)
