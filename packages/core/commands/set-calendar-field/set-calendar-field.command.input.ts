import { z } from 'zod'
import { tableIdSchema } from '../../value-objects'
import { setCalendarFieldSchema, viewNameSchema } from '../../view'

export const setCalendarFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewKey: viewNameSchema.optional(),
  })
  .merge(setCalendarFieldSchema)
