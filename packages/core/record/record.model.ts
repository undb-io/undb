import { z } from 'zod'
import { autoIncrementQueryValue } from '../field/auto-increment-field.type.js'
import { fieldQueryValue } from '../field/index.js'
import { fieldIdSchema } from '../field/value-objects/field-id.schema.js'
import { recordIdSchema } from './value-objects/record-id.schema.js'

export const recordModel = z.object({
  id: recordIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  autoIncrement: autoIncrementQueryValue.optional(),
  values: z.record(fieldIdSchema, fieldQueryValue),
})

export type IRecordModel = z.infer<typeof recordModel>
export type IRecordModelValues = IRecordModel['values']
