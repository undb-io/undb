import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { setCalendarFieldSchema, viewNameSchema } from '../../view/index.js'

export const setCalendarFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewKey: viewNameSchema.optional(),
  })
  .merge(setCalendarFieldSchema)
