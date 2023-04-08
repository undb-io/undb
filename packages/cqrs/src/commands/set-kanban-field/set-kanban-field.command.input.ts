import { setKanbanFieldSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const setKanbanFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setKanbanFieldSchema)
