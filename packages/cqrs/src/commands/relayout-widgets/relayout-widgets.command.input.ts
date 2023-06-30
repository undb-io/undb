import { relayoutWidgetSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const relayoutWidgetsCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  widgets: relayoutWidgetSchema.array(),
})
