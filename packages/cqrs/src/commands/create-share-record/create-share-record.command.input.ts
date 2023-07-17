import type { Field } from '@undb/core'
import { createMutateRecordValuesSchema, recordIdSchema, tableIdSchema } from '@undb/core'
import { shareTargetSchema } from '@undb/integrations'
import * as z from 'zod'

export const createCreateShareRecordCommandInput = (fields: Field[]) =>
  z.object({
    tableId: tableIdSchema,
    target: shareTargetSchema,
    id: recordIdSchema.optional(),
    values: createMutateRecordValuesSchema(fields),
  })

export type ICreateShareRecordInput = z.infer<ReturnType<typeof createCreateShareRecordCommandInput>>
