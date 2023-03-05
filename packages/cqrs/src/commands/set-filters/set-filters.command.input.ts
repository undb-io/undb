import { rootFilter, tableIdSchema, viewIdSchema } from '@egodb/core'
import { z } from 'zod'

export const setFiltersCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  filter: rootFilter.nullable(),
})
