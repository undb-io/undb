import { createBaseSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const createBaseCommandInput = createBaseSchema.merge(
  z.object({
    tableIds: tableIdSchema.array().nonempty().optional(),
  }),
)
