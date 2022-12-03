import { z } from 'zod'
import { createFieldsSchema_internal } from '../field'
import { recordIdSchema } from './value-objects'

export const createRecordInput_internal = z.object({
  id: recordIdSchema.optional(),
  value: createFieldsSchema_internal,
})
export type ICreateRecordInput_internal = z.infer<typeof createRecordInput_internal>
