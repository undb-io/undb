import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema'
import { optionIdSchema, updateOptionSchema } from '../../option'
import { tableIdSchema } from '../../value-objects'

export const updateOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  id: optionIdSchema,
  option: updateOptionSchema,
})
