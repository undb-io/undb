import { baseIdSchema, updateBaseSchema } from '@undb/core'
import { z } from 'zod'

export const updateBaseCommandInput = updateBaseSchema.merge(
  z.object({
    id: baseIdSchema,
  }),
)
