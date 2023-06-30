import { viewIdSchema, visualizationIdSchema } from '@undb/core'
import * as z from 'zod'

export const getShareAggregateNumberQuerySchema = z.object({
  viewId: viewIdSchema,
  visualizationId: visualizationIdSchema,
})
