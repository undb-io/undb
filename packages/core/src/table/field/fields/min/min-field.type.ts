import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { fieldIdSchema } from '../../value-objects/field-id.schema.js'
import type { FieldId } from '../../value-objects/field-id.vo.js'
import { MinField } from './min-field.js'

export const minTypeSchema = z.literal('min')
export type MinType = z.infer<typeof minTypeSchema>
const minTypeObjectSchema = z.object({
  [FIELD_TYPE_KEY]: minTypeSchema,
})

export const createMinFieldSchema = createBaseFieldSchema.merge(minTypeObjectSchema).merge(
  z.object({
    referenceFieldId: fieldIdSchema,
    aggregateFieldId: fieldIdSchema,
  }),
)
export type ICreateMinFieldInput = z.infer<typeof createMinFieldSchema>

export const updateMinFieldSchema = updateBaseFieldSchema.merge(minTypeObjectSchema).merge(
  z
    .object({
      referenceFieldId: fieldIdSchema,
      aggregateFieldId: fieldIdSchema,
    })
    .partial(),
)
export type IUpdateMinFieldInput = z.infer<typeof updateMinFieldSchema>

export const minFieldQuerySchema = baseFieldQuerySchema.merge(minTypeObjectSchema).merge(
  z
    .object({
      referenceFieldId: fieldIdSchema,
      aggregateFieldId: fieldIdSchema,
    })
    .partial(),
)
export type IMinFieldQuerySchema = z.infer<typeof minFieldQuerySchema>

export const minFieldValue = z.number().nullable()
export type IMinFieldValue = z.infer<typeof minFieldValue>

export const createMinFieldValue = minFieldValue
export type ICreateMinFieldValue = z.infer<typeof createMinFieldValue>

export const minFieldQueryValue = minFieldValue
export type IMinFieldQueryValue = z.infer<typeof minFieldQueryValue>

export const createMinFieldValue_internal = z
  .object({ value: createMinFieldValue })
  .merge(minTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(MinField) }))
export type ICreateMinFieldValue_internal = z.infer<typeof createMinFieldValue_internal>

export const minReadableValueSchema = minFieldQueryValue

export type IMinField = IBaseField & { referenceFieldId: FieldId; aggregateFieldId: FieldId }
