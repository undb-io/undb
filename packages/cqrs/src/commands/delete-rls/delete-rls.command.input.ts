import { rlsIdSchema } from '@undb/authz'
import { z } from 'zod'

export const deleteRLSCommandInput = z.object({
  id: rlsIdSchema,
})
