import * as z from 'zod'
import { updateRecordSchema } from '../../record/record.schema'
import { tableIdSchema } from '../../value-objects'

export const updateRecordCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(updateRecordSchema)
export type IUpdateRecordCommandInput = z.infer<typeof updateRecordCommandInput>
