import type { Merge, ValueOf } from 'type-fest'
import { z } from 'zod'
import type { Field, FieldValue } from '../field/index.js'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_DISPLAY_VALUES_NAME,
  INTERNAL_INCREAMENT_ID_NAME,
} from '../field/index.js'
import { recordDisplayValues } from './record.type.js'
import { recordIdSchema } from './value-objects/record-id.schema.js'

export const internalRecordValues = z.object({
  [INTERNAL_COLUMN_ID_NAME]: recordIdSchema,
  [INTERNAL_COLUMN_CREATED_AT_NAME]: z.string().datetime(),
  [INTERNAL_COLUMN_UPDATED_AT_NAME]: z.string().datetime(),
  [INTERNAL_INCREAMENT_ID_NAME]: z.number().optional(),
  [INTERNAL_DISPLAY_VALUES_NAME]: recordDisplayValues.optional(),
})

export type IInternalRecordValues = z.infer<typeof internalRecordValues>

export type RecordValueJSON = Record<string, FieldValue>

export type RecordAllValues = Merge<RecordValueJSON, IInternalRecordValues>

export type RecordAllValueType = ValueOf<RecordAllValues> | ValueOf<IInternalRecordValues>

export const createMutateRecordValuesSchema = (fields: Field[]) => {
  let schema = z.object({})

  for (const field of fields) {
    if (field.controlled) continue
    schema = schema.setKey(field.id.value, field.valueSchema)
  }

  return schema
}

export type IMutateRecordValueSchema = z.infer<ReturnType<typeof createMutateRecordValuesSchema>>
