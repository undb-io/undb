import { createMutateRecordValuesSchema, Field, recordIdSchema, tableIdSchema } from '@egodb/core'
import * as z from 'zod'

export const createUpdateRecordCommandInput = (fields: Field[]) =>
  z.object({
    tableId: tableIdSchema,
    id: recordIdSchema,
    values: createMutateRecordValuesSchema(fields),
  })

export type IUpdateRecordCommandInput = z.infer<ReturnType<typeof createUpdateRecordCommandInput>>
