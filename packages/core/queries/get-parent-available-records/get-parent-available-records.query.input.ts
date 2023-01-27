import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema'
import { recordIdSchema } from '../../record/value-objects/record-id.schema'
import { tableIdSchema } from '../../value-objects'
import { viewIdSchema } from '../../view/view-id.vo'

export const getParentAvailableRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  parentFieldId: fieldIdSchema,
  recordId: recordIdSchema.optional(),
  viewId: viewIdSchema.optional(),
})
