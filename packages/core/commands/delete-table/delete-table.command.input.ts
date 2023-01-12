import * as z from 'zod'
import { tableIdSchema } from '../../value-objects'

export const deleteTableCommandInput = z.object({
  id: tableIdSchema,
})
export type IDeleteTableInput = z.infer<typeof deleteTableCommandInput>
