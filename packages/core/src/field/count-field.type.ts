import * as z from 'zod'
import { CountField } from './count-field.js'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from './field-base.schema.js'
import { FIELD_TYPE_KEY } from './field.constants.js'

export const countTypeSchema = z.literal('count')
export type CountType = z.infer<typeof countTypeSchema>
const countTypeObjectSchema = z.object({
  [FIELD_TYPE_KEY]: countTypeSchema,
})

export const createCountFieldSchema = createBaseFieldSchema.merge(countTypeObjectSchema)
export type ICreateCountFieldInput = z.infer<typeof createCountFieldSchema>

export const updateCountFieldSchema = updateBaseFieldSchema.merge(countTypeObjectSchema)
export type IUpdateCountFieldInput = z.infer<typeof updateCountFieldSchema>

export const countFieldQuerySchema = baseFieldQuerySchema.merge(countTypeObjectSchema)
export type ICountFieldQuerySchema = z.infer<typeof countFieldQuerySchema>

export const countFieldValue = z.number().nullable()
export type ICountFieldValue = z.infer<typeof countFieldValue>

export const createCountFieldValue = countFieldValue
export type ICreateCountFieldValue = z.infer<typeof createCountFieldValue>

export const countFieldQueryValue = countFieldValue
export type ICountFieldQueryValue = z.infer<typeof countFieldQueryValue>

export const createCountFieldValue_internal = z
  .object({ value: createCountFieldValue })
  .merge(countTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(CountField) }))
export type ICreateCountFieldValue_internal = z.infer<typeof createCountFieldValue_internal>
