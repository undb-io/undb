import { z } from 'zod'
import { createFieldsSchema_internal, fieldIdSchema, fieldValue } from '../field'
import { recordIdSchema } from './value-objects'

export const createRecordInput_internal = z.object({
  id: recordIdSchema.optional(),
  value: createFieldsSchema_internal,
})
export type ICreateRecordInput_internal = z.infer<typeof createRecordInput_internal>

export const queryRecordSchema = z.object({
  id: recordIdSchema,
  values: z.record(fieldIdSchema, fieldValue),
})
export type IQueryRecordSchema = z.infer<typeof queryRecordSchema>
