import type { Merge, ValueOf } from 'type-fest'
import type { ZodDefault, ZodObject, ZodRawShape, ZodTypeAny } from 'zod'
import { z } from 'zod'
import { userIdSchema } from '../../user/value-objects/user-id.vo.js'
import type { Field, FieldValue, ICollaboratorProfile } from '../field/index.js'
import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_CREATED_BY_PROFILE_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
  INTERNAL_COLUMN_UPDATED_BY_PROFILE_NAME,
  INTERNAL_DISPLAY_VALUES_NAME,
  INTERNAL_INCREMENT_ID_NAME,
  collaboratorProfile,
} from '../field/index.js'
import type { FormFields } from '../form/form-fields.vo.js'
import { recordDisplayValues } from './record.type.js'
import { recordIdSchema } from './value-objects/record-id.schema.js'

export const internalRecordValues = z.object({
  [INTERNAL_COLUMN_ID_NAME]: recordIdSchema,
  [INTERNAL_COLUMN_CREATED_AT_NAME]: z.string(),
  [INTERNAL_COLUMN_CREATED_BY_NAME]: userIdSchema,
  [INTERNAL_COLUMN_CREATED_BY_PROFILE_NAME]: collaboratorProfile.nullable(),
  [INTERNAL_COLUMN_UPDATED_AT_NAME]: z.string(),
  [INTERNAL_COLUMN_UPDATED_BY_NAME]: userIdSchema,
  [INTERNAL_COLUMN_UPDATED_BY_PROFILE_NAME]: collaboratorProfile.nullable(),
  [INTERNAL_INCREMENT_ID_NAME]: z.number().optional(),
  [INTERNAL_DISPLAY_VALUES_NAME]: recordDisplayValues.optional(),
})

export type IInternalRecordValues = z.infer<typeof internalRecordValues>

export type RecordValuePair = Record<string, FieldValue>
// TODO: type values
export type RecordValueJSON = Record<string, any>

export type RecordAllValues = Merge<RecordValuePair, IInternalRecordValues>
export type RecordAllJSON = Merge<RecordValueJSON, IInternalRecordValues>

export type RecordAllValueType = ValueOf<RecordAllValues> | ValueOf<IInternalRecordValues> | ICollaboratorProfile

export const createMutateRecordValuesSchema = (
  fields: Field[],
  defaultValues: Record<string, any> | undefined = undefined,
  formFields?: FormFields,
): ZodObject<any> => {
  const shape: ZodRawShape = {}

  for (const field of fields) {
    let fieldSchema = field.valueSchema as ZodDefault<ZodTypeAny>
    if (formFields?.isRequired(field.id.value)) {
      fieldSchema = fieldSchema.isOptional() ? fieldSchema.optional().unwrap() : fieldSchema
    }
    const nested = fieldSchema
    shape[field.id.value] = defaultValues ? nested.default(defaultValues[field.id.value]) : nested.optional()
  }

  return z.object(shape)
}

export type IMutateRecordValueSchema = z.infer<ReturnType<typeof createMutateRecordValuesSchema>>
