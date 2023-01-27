import { z } from 'zod'
import { tableIdSchema } from '../../value-objects'
import { setTreeViewFieldSchema, viewNameSchema } from '../../view'

export const setTreeViewFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewKey: viewNameSchema.optional(),
  })
  .merge(setTreeViewFieldSchema)
