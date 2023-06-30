import { viewIdSchema, visualizationIdSchema } from '@undb/core'
import * as z from 'zod'

export const getShareAggregateChartQuerySchema = z.object({
  viewId: viewIdSchema,
  visualizationId: visualizationIdSchema,
})
