import * as z from 'zod'
import { fieldKeySchema } from '../../field/value-objects/field-key.schema'
import { tableIdSchema } from '../../value-objects'

export const deleteFieldCommandInput = z.object({
  tableId: tableIdSchema,
  id: fieldKeySchema,
})
export type IDeleteFieldInput = z.infer<typeof deleteFieldCommandInput>
