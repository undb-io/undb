import * as z from 'zod'
import { createOptionSchema } from '../../option'
import { tableIdSchema } from '../../value-objects'

export const createOptionCommandInput = z.object({
  tableId: tableIdSchema,
  option: createOptionSchema,
})
