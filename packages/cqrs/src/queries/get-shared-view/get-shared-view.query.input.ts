import { viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const getSharedViewQueryInput = z.object({
  viewId: viewIdSchema,
})
