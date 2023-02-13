import { z } from 'zod'
import { rootFilter } from '../../filter/index.js'
import { tableIdSchema } from '../../value-objects/index.js'
import { viewIdSchema } from '../../view/view-id.vo.js'

export const setFiltersCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  filter: rootFilter.nullable(),
})
