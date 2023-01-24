import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema'
import { createOptionSchema } from '../../option'
import { tableIdSchema } from '../../value-objects'

export const createOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  option: createOptionSchema,
})
