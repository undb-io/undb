import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { setKanbanFieldSchema, viewNameSchema } from '../../view/index.js'

export const setKanbanFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewKey: viewNameSchema.optional(),
  })
  .merge(setKanbanFieldSchema)
