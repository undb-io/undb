import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { fieldIdSchema } from '../../value-objects/field-id.schema.js'
import type { FieldId } from '../../value-objects/field-id.vo.js'
import { SumField } from './sum-field.js'

export const sumTypeSchema = z.literal('sum')
export type SumType = z.infer<typeof sumTypeSchema>
const sumTypeObjectSchema = z.object({
  [FIELD_TYPE_KEY]: sumTypeSchema,
})

export const createSumFieldSchema = createBaseFieldSchema.merge(sumTypeObjectSchema).merge(
  z.object({
    referenceFieldId: fieldIdSchema,
    aggregateFieldId: fieldIdSchema,
  }),
)
export type ICreateSumFieldInput = z.infer<typeof createSumFieldSchema>

export const updateSumFieldSchema = updateBaseFieldSchema.merge(sumTypeObjectSchema).merge(
  z
    .object({
      referenceFieldId: fieldIdSchema,
      aggregateFieldId: fieldIdSchema,
    })
    .partial(),
)
export type IUpdateSumFieldInput = z.infer<typeof updateSumFieldSchema>

export const sumFieldQuerySchema = baseFieldQuerySchema.merge(sumTypeObjectSchema).merge(
  z
    .object({
      referenceFieldId: fieldIdSchema,
      aggregateFieldId: fieldIdSchema,
    })
    .partial(),
)
export type ISumFieldQuerySchema = z.infer<typeof sumFieldQuerySchema>

export const sumFieldValue = z.number().nullable()
export type ISumFieldValue = z.infer<typeof sumFieldValue>

export const createSumFieldValue = sumFieldValue
export type ICreateSumFieldValue = z.infer<typeof createSumFieldValue>

export const sumFieldQueryValue = sumFieldValue
export type ISumFieldQueryValue = z.infer<typeof sumFieldQueryValue>

export const createSumFieldValue_internal = z
  .object({ value: createSumFieldValue })
  .merge(sumTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(SumField) }))
export type ICreateSumFieldValue_internal = z.infer<typeof createSumFieldValue_internal>

export const sumReadableValueSchema = sumFieldQueryValue

export type ISumField = IBaseField & { referenceFieldId: FieldId; aggregateFieldId: FieldId }
