import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema'
import { tableIdSchema } from '../../value-objects'
import { viewNameSchema } from '../../view'

export const getRecordsTreeQueryInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  viewKey: viewNameSchema.optional(),
})
