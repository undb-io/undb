import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { setCalendarFieldSchema } from '../../view/index.js'
import { viewIdSchema } from '../../view/view-id.vo.js'

export const setCalendarFieldCommandInput = z
  .object({
    tableId: tableIdSchema,
    viewId: viewIdSchema.optional(),
  })
  .merge(setCalendarFieldSchema)
