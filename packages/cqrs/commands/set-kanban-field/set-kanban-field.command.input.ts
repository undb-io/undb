import { setKanbanFieldSchema, tableIdSchema, viewIdSchema } from '@egodb/core'
import { z } from 'zod'

export const setKanbanFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setKanbanFieldSchema)
