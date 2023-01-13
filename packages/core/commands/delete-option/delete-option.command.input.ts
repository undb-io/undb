import * as z from 'zod'
import { fieldIdSchema } from '../../field'
import { optionIdSchema } from '../../option'
import { tableIdSchema } from '../../value-objects'

export const deleteOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  id: optionIdSchema,
})
export type IDeleteOptionInput = z.infer<typeof deleteOptionCommandInput>
