import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'
import { recordIdSchema } from '../../record/value-objects/record-id.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'
import { viewIdSchema } from '../../view/view-id.vo.js'

export const getTreeAvailableRecordsQueryInput = z.object({
  tableId: tableIdSchema,
  treeFieldId: fieldIdSchema,
  recordId: recordIdSchema.optional(),
  viewId: viewIdSchema.optional(),
})
