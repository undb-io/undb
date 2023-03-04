import type { Merge, ValueOf } from 'type-fest'
import { z } from 'zod'
import type { FieldValue } from '../field/index.js'
import {
  createFieldValueSchema,
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_DISPLAY_VALUES_NAME,
  INTERNAL_INCREAMENT_ID_NAME,
} from '../field/index.js'
import { fieldIdSchema } from '../field/value-objects/field-id.schema.js'
import { recordDisplayValues } from './record.type.js'
import { recordIdSchema } from './value-objects/record-id.schema.js'

export const mutateRecordValueSchema = z
  .array(
    z.object({
      id: fieldIdSchema,
      value: createFieldValueSchema,
    }),
  )
  .min(1)
export type IMutateRecordValueSchema = z.infer<typeof mutateRecordValueSchema>

export const updateRecordSchema = z.object({
  id: recordIdSchema,
  value: mutateRecordValueSchema,
})
export type IUpdateRecordValueSchema = z.infer<typeof updateRecordSchema>

export const internalRecordValues = z.object({
  [INTERNAL_COLUMN_ID_NAME]: recordIdSchema,
  [INTERNAL_COLUMN_CREATED_AT_NAME]: z.date(),
  [INTERNAL_COLUMN_UPDATED_AT_NAME]: z.date(),
  [INTERNAL_INCREAMENT_ID_NAME]: z.number().optional(),
  [INTERNAL_DISPLAY_VALUES_NAME]: recordDisplayValues.optional(),
})

export type IInternalRecordValues = z.infer<typeof internalRecordValues>

export type RecordValueJSON = Record<string, FieldValue>

export type RecordAllValues = Merge<RecordValueJSON, IInternalRecordValues>

export type RecordAllValueType = ValueOf<RecordAllValues> | ValueOf<IInternalRecordValues>
