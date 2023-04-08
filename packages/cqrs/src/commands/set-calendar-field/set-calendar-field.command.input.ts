import { setCalendarFieldSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const setCalendarFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setCalendarFieldSchema)
