import * as z from 'zod'
import { updateRecordSchema } from '../../record/record.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const updateRecordCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(updateRecordSchema)
export type IUpdateRecordCommandInput = z.infer<typeof updateRecordCommandInput>
