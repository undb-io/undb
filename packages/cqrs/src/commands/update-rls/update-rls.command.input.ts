import { rlsIdSchema, updateRLSSchema } from '@undb/authz'
import { z } from 'zod'

export const updateRLSCommandInput = z
  .object({
    id: rlsIdSchema,
  })
  .merge(updateRLSSchema)
