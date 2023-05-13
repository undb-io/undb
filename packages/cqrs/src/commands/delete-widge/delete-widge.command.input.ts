import { tableIdSchema, viewIdSchema, widgeIdSchema } from '@undb/core'
import { z } from 'zod'

export const deleteWidgeCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  widgeId: widgeIdSchema,
})
