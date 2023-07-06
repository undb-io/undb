import { setGanttFieldSchema, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'

export const setGanttFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setGanttFieldSchema)
