import { tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const getTableRLSSQueryInput = z.object({
  tableId: tableIdSchema,
})
