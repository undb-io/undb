import { fieldIdSchema, tableIdSchema } from '@egodb/core'
import * as z from 'zod'

export const deleteFieldCommandInput = z.object({
  tableId: tableIdSchema,
  id: fieldIdSchema,
})
export type IDeleteFieldInput = z.infer<typeof deleteFieldCommandInput>
