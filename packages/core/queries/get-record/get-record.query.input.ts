import * as z from 'zod'
import { recordIdSchema } from '../../record/value-objects/record-id.schema'
import { tableIdSchema } from '../../value-objects'

export const getRecordQueryInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema,
})
