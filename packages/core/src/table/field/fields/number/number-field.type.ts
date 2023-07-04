import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { NumberField } from './number-field.js'

export const numberTypeSchema = z.literal('number')
export type NumberType = z.infer<typeof numberTypeSchema>
const numberTypeObjectSchema = z.object({
  [FIELD_TYPE_KEY]: numberTypeSchema,
})

export const createNumberFieldSchema = createBaseFieldSchema.merge(numberTypeObjectSchema)
export type ICreateNumberFieldInput = z.infer<typeof createNumberFieldSchema>

export const updateNumberFieldSchema = updateBaseFieldSchema.merge(numberTypeObjectSchema)
export type IUpdateNumberFieldInput = z.infer<typeof updateNumberFieldSchema>

export const numberFieldQuerySchema = baseFieldQuerySchema.merge(numberTypeObjectSchema)
export type INumberFieldQuerySchema = z.infer<typeof numberFieldQuerySchema>

export const numberFieldValue = z.number().or(z.null())
export type INumberFieldValue = z.infer<typeof numberFieldValue>

export const createNumberFieldValue = numberFieldValue
export type ICreateNumberFieldValue = z.infer<typeof createNumberFieldValue>

export const numberFieldQueryValue = numberFieldValue
export type INumberFieldQueryValue = z.infer<typeof numberFieldQueryValue>

export const createNumberFieldValue_internal = z
  .object({ value: createNumberFieldValue })
  .merge(numberTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(NumberField) }))
export type ICreateNumberFieldValue_internal = z.infer<typeof createNumberFieldValue_internal>

export const numberReadableValueSchema = numberFieldQueryValue

export type INumberField = IBaseField
