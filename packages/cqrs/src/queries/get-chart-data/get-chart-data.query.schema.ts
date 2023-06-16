import { tableIdSchema, viewIdSchema, visualizationIdSchema } from '@undb/core'
import * as z from 'zod'

export const getChartDataQuerySchema = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  visualizationId: visualizationIdSchema,
})
