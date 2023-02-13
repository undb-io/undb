import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { sortsSchema } from '../../view/index.js'
import { viewIdSchema } from '../../view/view-id.vo.js'

export const setSortsCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  sorts: sortsSchema,
})
