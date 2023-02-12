import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { setTreeViewFieldSchema, viewNameSchema } from '../../view/index.js'

export const setTreeViewFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewKey: viewNameSchema.optional(),
  })
  .merge(setTreeViewFieldSchema)
