import { z } from 'zod'
import { fieldQueryValue } from '../field'
import { autoIncrementQueryValue } from '../field/auto-increment-field.type'
import { fieldIdSchema } from '../field/value-objects/field-id.schema'
import { recordIdSchema } from './value-objects/record-id.schema'

export const recordModel = z.object({
  id: recordIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  autoIncrement: autoIncrementQueryValue.optional(),
  values: z.record(fieldIdSchema, fieldQueryValue),
})

export type IRecordModel = z.infer<typeof recordModel>
export type IRecordModelValues = IRecordModel['values']
