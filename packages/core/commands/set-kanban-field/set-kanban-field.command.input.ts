import { z } from 'zod'
import { fieldIdSchema } from '../../field'
import { tableIdSchema } from '../../value-objects'
import { viewNameSchema } from '../../view'

export const setKanbanFieldCommandInput = z.object({
  tableId: tableIdSchema,
  viewName: viewNameSchema.optional(),
  field: fieldIdSchema,
})
