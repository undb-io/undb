import { apiTokenIdSchema } from '@undb/openapi'
import { z } from 'zod'

export const deleteApiTokenCommandInput = z.object({
  apiTokenId: apiTokenIdSchema,
})
