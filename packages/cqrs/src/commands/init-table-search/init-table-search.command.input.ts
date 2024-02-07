import { tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const initTableSearchCommandInput = z.object({
  tableId: tableIdSchema,
})

export type IInitTableSearchCommandInput = z.infer<typeof initTableSearchCommandInput>
