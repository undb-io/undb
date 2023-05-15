import { tableIdSchema, viewIdSchema, virsualizationIdSchema } from '@undb/core'
import * as z from 'zod'

export const aggregateNumberQuerySchema = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  virsualizationId: virsualizationIdSchema,
})
