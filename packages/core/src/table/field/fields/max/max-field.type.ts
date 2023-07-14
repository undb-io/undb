import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { fieldIdSchema } from '../../value-objects/field-id.schema.js'
import type { FieldId } from '../../value-objects/field-id.vo.js'
import { MaxField } from './max-field.js'

export const maxTypeSchema = z.literal('max')
export type MaxType = z.infer<typeof maxTypeSchema>
const maxTypeObjectSchema = z.object({
  [FIELD_TYPE_KEY]: maxTypeSchema,
})

export const createMaxFieldSchema = createBaseFieldSchema.merge(maxTypeObjectSchema).merge(
  z.object({
    referenceFieldId: fieldIdSchema,
    aggregateFieldId: fieldIdSchema,
  }),
)
export type ICreateMaxFieldInput = z.infer<typeof createMaxFieldSchema>

export const updateMaxFieldSchema = updateBaseFieldSchema.merge(maxTypeObjectSchema).merge(
  z
    .object({
      referenceFieldId: fieldIdSchema,
      aggregateFieldId: fieldIdSchema,
    })
    .partial(),
)
export type IUpdateMaxFieldInput = z.infer<typeof updateMaxFieldSchema>

export const maxFieldQuerySchema = baseFieldQuerySchema.merge(maxTypeObjectSchema).merge(
  z
    .object({
      referenceFieldId: fieldIdSchema,
      aggregateFieldId: fieldIdSchema,
    })
    .partial(),
)
export type IMaxFieldQuerySchema = z.infer<typeof maxFieldQuerySchema>

export const maxFieldValue = z.number().nullable()
export type IMaxFieldValue = z.infer<typeof maxFieldValue>

export const createMaxFieldValue = maxFieldValue
export type ICreateMaxFieldValue = z.infer<typeof createMaxFieldValue>

export const maxFieldQueryValue = maxFieldValue
export type IMaxFieldQueryValue = z.infer<typeof maxFieldQueryValue>

export const createMaxFieldValue_internal = z
  .object({ value: createMaxFieldValue })
  .merge(maxTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(MaxField) }))
export type ICreateMaxFieldValue_internal = z.infer<typeof createMaxFieldValue_internal>

export const maxReadableValueSchema = maxFieldQueryValue

export type IMaxField = IBaseField & { referenceFieldId: FieldId; aggregateFieldId: FieldId }
