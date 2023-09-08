import { flsIdSchema } from '@undb/authz'
import { z } from 'zod'

export const deleteFLSCommandInput = z.object({
  id: flsIdSchema,
})
