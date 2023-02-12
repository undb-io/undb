import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base.js'
import { FIELD_TYPE_KEY } from './field.constant.js'
import { NumberField } from './number-field.js'

export const numberTypeSchema = z.literal('number')
export type NumberType = z.infer<typeof numberTypeSchema>
const numberTypeObjectSchema = z.object({
  [FIELD_TYPE_KEY]: numberTypeSchema,
})

export const createNumberFieldSchema = createBaseFieldsSchema.merge(numberTypeObjectSchema)
export type ICreateNumberFieldInput = z.infer<typeof createNumberFieldSchema>

export const numberFieldQuerySchema = baseFieldQuerySchema.merge(numberTypeObjectSchema)

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
