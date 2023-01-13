import type { Merge } from 'type-fest'
import { z } from 'zod'
import type { FieldValue } from '../field'
import {
  createFieldValueSchema,
  INTERNAL_FIELD_CREATED_AT_NAME,
  INTERNAL_FIELD_ID_NAME,
  INTERNAL_FIELD_UPDATED_AT_NAME,
} from '../field'
import { fieldNameSchema } from '../field/value-objects/field-name.schema'
import { recordIdSchema } from './value-objects'

export const mutateRecordValueSchema = z
  .array(
    z.object({
      id: fieldNameSchema,
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
  [INTERNAL_FIELD_ID_NAME]: recordIdSchema,
  [INTERNAL_FIELD_CREATED_AT_NAME]: z.date(),
  [INTERNAL_FIELD_UPDATED_AT_NAME]: z.date(),
})

export type IInternalRecordValues = z.infer<typeof internalRecordValues>

export type RecordValueJSON = Record<string, FieldValue>

export type RecordAllValues = Merge<RecordValueJSON, IInternalRecordValues>
