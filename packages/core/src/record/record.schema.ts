import type { Merge, ValueOf } from 'type-fest'
import type { ZodAny, ZodNullable, ZodOptional, ZodType } from 'zod'
import { z } from 'zod'
import type { FieldValue, IFieldType } from '../field/index.js'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_DISPLAY_VALUES_NAME,
  INTERNAL_INCREAMENT_ID_NAME,
  mutateFieldValueSchemaMap,
} from '../field/index.js'
import { recordDisplayValues } from './record.type.js'
import { recordIdSchema } from './value-objects/record-id.schema.js'

export const updateRecordSchema = z.object({
  id: recordIdSchema,
  // FIXME: remove me
  value: z.any(),
})
export type IUpdateRecordValueSchema = z.infer<typeof updateRecordSchema>

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

export const createMutateRecordValuesSchema = (fields: { id: string; type: IFieldType; required: boolean }[]) => {
  let schema = z.object({})

  for (const field of fields) {
    let fieldSchema: ZodType = mutateFieldValueSchemaMap[field.type]
    if (!field.required) {
      fieldSchema = fieldSchema.optional()
    } else {
      if (fieldSchema.isNullable()) {
        fieldSchema = (fieldSchema as ZodNullable<ZodAny>).unwrap()
      }
      if (fieldSchema.isOptional()) {
        fieldSchema = (fieldSchema as ZodOptional<ZodAny>).unwrap()
      }
    }
    schema = schema.setKey(field.id, fieldSchema)
  }

  return schema
}

export type IMutateRecordValueSchema = z.infer<ReturnType<typeof createMutateRecordValuesSchema>>
