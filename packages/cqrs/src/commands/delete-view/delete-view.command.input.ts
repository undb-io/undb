import { tableIdSchema, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const deleteViewCommandInput = z.object({
  tableId: tableIdSchema,
  id: viewIdSchema,
})
export type IDeleteViewInput = z.infer<typeof deleteViewCommandInput>
