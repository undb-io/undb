import { z } from 'zod'
import { tableIdSchema, tableNameSchema } from '../../value-objects'

export const editTableCommandInput = z
  .object({
    id: tableIdSchema,
  })
  .merge(
    z
      .object({
        name: tableNameSchema,
      })
      .partial(),
  )
