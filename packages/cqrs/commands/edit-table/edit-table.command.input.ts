import { editTableSchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const editTableCommandInput = z
  .object({
    id: tableIdSchema,
  })
  .merge(editTableSchema)
