import { createWidgetSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const createWidgetCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  widget: createWidgetSchema,
})
