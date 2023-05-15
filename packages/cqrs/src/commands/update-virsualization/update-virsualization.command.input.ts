import { tableIdSchema, updateVirsualizationSchema } from '@undb/core'
import { z } from 'zod'

export const updateVirsualizationCommandInput = z.object({
  tableId: tableIdSchema,
  virsualization: updateVirsualizationSchema,
})
