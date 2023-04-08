import { tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const deleteTableCommandInput = z.object({
  id: tableIdSchema,
})
export type IDeleteTableInput = z.infer<typeof deleteTableCommandInput>
