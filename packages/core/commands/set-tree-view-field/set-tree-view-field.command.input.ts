import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { setTreeViewFieldSchema } from '../../view/index.js'
import { viewIdSchema } from '../../view/view-id.vo.js'

export const setTreeViewFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setTreeViewFieldSchema)
