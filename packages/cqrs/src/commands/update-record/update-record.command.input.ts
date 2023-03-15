import { createMutateRecordValuesSchema, recordIdSchema, tableIdSchema, TableSchema } from '@egodb/core'
import * as z from 'zod'

export const createUpdateRecordCommandInput = (schema: TableSchema) =>
  z.object({
    tableId: tableIdSchema,
    id: recordIdSchema,
    values: createMutateRecordValuesSchema(schema),
  })

export type IUpdateRecordCommandInput = z.infer<ReturnType<typeof createUpdateRecordCommandInput>>
