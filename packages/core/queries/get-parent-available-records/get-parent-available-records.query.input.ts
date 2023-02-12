import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'
import { recordIdSchema } from '../../record/value-objects/record-id.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'
import { viewIdSchema } from '../../view/view-id.vo.js'

export const getParentAvailableRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  parentFieldId: fieldIdSchema,
  recordId: recordIdSchema.optional(),
  viewId: viewIdSchema.optional(),
})
