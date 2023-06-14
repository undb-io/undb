import { tableIdSchema, updateVisualizationSchema } from '@undb/core'
import { z } from 'zod'

export const updateVisualizationCommandInput = z.object({
  tableId: tableIdSchema,
  visualization: updateVisualizationSchema,
})
