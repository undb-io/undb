import * as z from 'zod'
import { fieldKeySchema } from '../../field/value-objects/field-key.schema'
import { createOptionSchema } from '../../option'
import { tableIdSchema } from '../../value-objects'

export const createOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldKeySchema,
  option: createOptionSchema,
})
