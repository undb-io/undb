import { setTreeViewFieldSchema, tableIdSchema, viewIdSchema } from '@egodb/core'
import { z } from 'zod'

export const setTreeViewFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setTreeViewFieldSchema)
