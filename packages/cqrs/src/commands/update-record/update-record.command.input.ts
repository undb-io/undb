import { tableIdSchema, updateRecordSchema } from '@egodb/core'
import * as z from 'zod'

export const updateRecordCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(updateRecordSchema)
export type IUpdateRecordCommandInput = z.infer<typeof updateRecordCommandInput>
