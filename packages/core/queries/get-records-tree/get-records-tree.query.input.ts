import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'
import { viewNameSchema } from '../../view/index.js'

export const getRecordsTreeQueryInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  viewKey: viewNameSchema.optional(),
})
