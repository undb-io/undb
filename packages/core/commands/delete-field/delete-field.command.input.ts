import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const deleteFieldCommandInput = z.object({
  tableId: tableIdSchema,
  id: fieldIdSchema,
})
export type IDeleteFieldInput = z.infer<typeof deleteFieldCommandInput>
