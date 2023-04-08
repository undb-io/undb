import { setTreeViewFieldSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const setTreeViewFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setTreeViewFieldSchema)
