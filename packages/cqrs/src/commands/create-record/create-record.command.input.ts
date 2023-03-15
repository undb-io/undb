import { createMutateRecordValuesSchema, IFieldType, recordIdSchema, tableIdSchema } from '@egodb/core'
import * as z from 'zod'

export const createCreateRecordCommandInput = (fields: { id: string; type: IFieldType; required: boolean }[]) => {
  return z.object({
    tableId: tableIdSchema,
    id: recordIdSchema.optional(),
    values: createMutateRecordValuesSchema(fields),
  })
}

export type ICreateRecordInput = z.infer<ReturnType<typeof createCreateRecordCommandInput>>
