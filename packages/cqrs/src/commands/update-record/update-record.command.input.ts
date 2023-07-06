import type { Field } from '@undb/core'
import { createMutateRecordValuesSchema, recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const baseUpdateRecordCommandInput = z.object({
  tableId: tableIdSchema,
  id: recordIdSchema,
})

export const createUpdateRecordCommandInput = (fields: Field[]) =>
  baseUpdateRecordCommandInput.merge(
    z.object({
      values: createMutateRecordValuesSchema(fields),
    }),
  )

export type IUpdateRecordCommandInput = z.infer<ReturnType<typeof createUpdateRecordCommandInput>>
