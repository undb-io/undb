import type { Field } from '@undb/core'
import { createMutateRecordValuesSchema, recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const createCreateRecordsCommandInput = (fields: Field[]) =>
  z.object({
    tableId: tableIdSchema,
    records: z
      .object({
        id: recordIdSchema.optional(),
        values: createMutateRecordValuesSchema(fields),
      })
      .array()
      .nonempty(),
  })

export type ICreateRecordsInput = z.infer<ReturnType<typeof createCreateRecordsCommandInput>>
