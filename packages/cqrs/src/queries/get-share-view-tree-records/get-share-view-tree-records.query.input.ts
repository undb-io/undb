import { fieldIdSchema, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const getShareViewTreeRecordsQueryInput = z.object({
  viewId: viewIdSchema,
  fieldId: fieldIdSchema,
})
