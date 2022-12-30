import { z } from 'zod'
import { tableIdSchema } from '../../value-objects'
import { setKanbanFieldSchema, viewNameSchema } from '../../view'

export const setKanbanFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewName: viewNameSchema.optional(),
  })
  .merge(setKanbanFieldSchema)
