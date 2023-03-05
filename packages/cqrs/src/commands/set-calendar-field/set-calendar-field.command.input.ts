import { setCalendarFieldSchema, tableIdSchema, viewIdSchema } from '@egodb/core'
import { z } from 'zod'

export const setCalendarFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setCalendarFieldSchema)
