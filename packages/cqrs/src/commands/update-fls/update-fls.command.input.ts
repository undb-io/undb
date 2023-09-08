import { flsIdSchema, updateFLSSchema } from '@undb/authz'
import { z } from 'zod'

export const updateFLSCommandInput = z
  .object({
    id: flsIdSchema,
  })
  .merge(updateFLSSchema)
