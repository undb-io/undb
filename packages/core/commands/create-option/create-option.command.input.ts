import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'
import { createOptionSchema } from '../../option/index.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const createOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  option: createOptionSchema,
})
