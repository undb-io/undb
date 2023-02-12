import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'
import { optionIdSchema, updateOptionSchema } from '../../option/index.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const updateOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  id: optionIdSchema,
  option: updateOptionSchema,
})
