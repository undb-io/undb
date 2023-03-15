import type { Merge, ValueOf } from 'type-fest'
import type { ZodAny, ZodNullable, ZodOptional, ZodType } from 'zod'
import { z } from 'zod'
import type { FieldValue } from '../field/index.js'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_DISPLAY_VALUES_NAME,
  INTERNAL_INCREAMENT_ID_NAME,
  mutateFieldValueSchemaMap,
} from '../field/index.js'
import type { TableSchema } from '../value-objects/table-schema.vo.js'
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

export const createMutateRecordValuesSchema = (tableSchema: TableSchema) => {
  let schema = z.object({})

  for (const field of tableSchema.fields) {
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
    schema = schema.setKey(field.id.value, fieldSchema)
  }

  return schema
}

export type IMutateRecordValueSchema = z.infer<ReturnType<typeof createMutateRecordValuesSchema>>
