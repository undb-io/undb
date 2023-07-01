import { recordIdSchema, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const getShareViewRecordQueryInput = z.object({
  viewId: viewIdSchema,
  id: recordIdSchema,
})
