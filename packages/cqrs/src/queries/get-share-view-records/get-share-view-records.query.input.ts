import { rootFilter, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const getShareViewRecordsQueryInput = z.object({
  viewId: viewIdSchema,
  filter: rootFilter.optional(),
  q: z.string().nonempty().optional(),
})
