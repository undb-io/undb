import type { Field } from '@undb/core'
import { createMutateRecordValuesSchema, recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const createCreateRecordCommandInput = (fields: Field[]) =>
  z.object({
    tableId: tableIdSchema,
    id: recordIdSchema.optional(),
    values: createMutateRecordValuesSchema(fields),
  })

export type ICreateRecordInput = z.infer<ReturnType<typeof createCreateRecordCommandInput>>
