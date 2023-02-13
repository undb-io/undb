import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { setKanbanFieldSchema } from '../../view/index.js'
import { viewIdSchema } from '../../view/view-id.vo.js'

export const setKanbanFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setKanbanFieldSchema)
