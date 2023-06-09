import type { Field } from '@undb/core'
import { createMutateRecordValuesSchema, recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const createUpdateRecordsCommandInput = (fields: Field[]) =>
  z.object({
    tableId: tableIdSchema,
    records: z
      .object({
        id: recordIdSchema,
        values: createMutateRecordValuesSchema(fields),
      })
      .array()
      .nonempty(),
  })

export type IUpdateRecordsInput = z.infer<ReturnType<typeof createUpdateRecordsCommandInput>>
