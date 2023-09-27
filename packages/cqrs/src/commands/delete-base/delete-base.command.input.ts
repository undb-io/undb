import { baseIdSchema } from '@undb/core'
import { z } from 'zod'

export const deleteBaseCommandInput = z.object({
  id: baseIdSchema,
})
