import { z } from 'zod'

import { autoIncrementQueryValue, fieldQueryValue } from '../field/index.js'
import { fieldIdSchema } from '../field/value-objects/field-id.schema.js'
import { recordIdSchema } from './value-objects/record-id.schema.js'

export const recordModel = z.object({
  autoIncrement: autoIncrementQueryValue.optional(),
  createdAt: z.date(),
  id: recordIdSchema,
  updatedAt: z.date(),
  values: z.record(fieldIdSchema, fieldQueryValue),
})

export type IRecordModel = z.infer<typeof recordModel>
export type IRecordModelValues = IRecordModel['values']
