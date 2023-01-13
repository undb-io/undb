import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema'
import { tableIdSchema } from '../../value-objects'

export const deleteFieldCommandInput = z.object({
  tableId: tableIdSchema,
  id: fieldIdSchema,
})
export type IDeleteFieldInput = z.infer<typeof deleteFieldCommandInput>
