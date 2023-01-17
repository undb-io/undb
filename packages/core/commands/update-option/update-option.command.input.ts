import * as z from 'zod'
import { fieldKeySchema } from '../../field/value-objects/field-key.schema'
import { optionIdSchema, updateOptionSchema } from '../../option'
import { tableIdSchema } from '../../value-objects'

export const updateOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldKeySchema,
  id: optionIdSchema,
  option: updateOptionSchema,
})
