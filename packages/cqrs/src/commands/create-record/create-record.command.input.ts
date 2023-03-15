import { createMutateRecordValuesSchema, recordIdSchema, tableIdSchema, TableSchema } from '@egodb/core'
import * as z from 'zod'

export const createCreateRecordCommandInput = (schema: TableSchema) =>
  z.object({
    tableId: tableIdSchema,
    id: recordIdSchema.optional(),
    values: createMutateRecordValuesSchema(schema),
  })

export type ICreateRecordInput = z.infer<ReturnType<typeof createCreateRecordCommandInput>>
