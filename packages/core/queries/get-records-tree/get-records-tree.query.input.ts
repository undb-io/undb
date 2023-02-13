import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'
import { viewIdSchema } from '../../view/view-id.vo.js'

export const getRecordsTreeQueryInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  viewId: viewIdSchema.optional(),
})
