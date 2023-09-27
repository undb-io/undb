import { baseIdSchema } from '@undb/core'
import * as z from 'zod'

export const getBaseByIdQueryInput = z.object({
  id: baseIdSchema,
})
