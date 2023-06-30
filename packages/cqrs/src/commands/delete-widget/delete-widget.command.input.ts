import { tableIdSchema, viewIdSchema, widgetIdSchema } from '@undb/core'
import { z } from 'zod'

export const deleteWidgetCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  widgetId: widgetIdSchema,
})
