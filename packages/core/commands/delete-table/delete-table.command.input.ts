import * as z from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'

export const deleteTableCommandInput = z.object({
  id: tableIdSchema,
})
export type IDeleteTableInput = z.infer<typeof deleteTableCommandInput>
