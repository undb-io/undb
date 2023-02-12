import { z } from 'zod'
import { rootFilter } from '../../filter/index.js'
import { tableIdSchema } from '../../value-objects/index.js'
import { viewNameSchema } from '../../view/index.js'

export const setFiltersCommandInput = z.object({
  tableId: tableIdSchema,
  viewKey: viewNameSchema.optional(),
  filter: rootFilter.nullable(),
})
