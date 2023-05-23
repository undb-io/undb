import * as z from 'zod'
import { CurrencyField } from './currency-field.js'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from './field-base.schema.js'
import { FIELD_TYPE_KEY } from './field.constants.js'

export const currencyTypeSchema = z.literal('currency')
export type CurrencyFieldType = z.infer<typeof currencyTypeSchema>
const currencyTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: currencyTypeSchema })

export const createCurrencyFieldSchema = createBaseFieldSchema.merge(currencyTypeObjectSchema)

export type ICreateCurrencyFieldInput = z.infer<typeof createCurrencyFieldSchema>

export const updateCurrencyFieldSchema = updateBaseFieldSchema.merge(currencyTypeObjectSchema)

export type IUpdateCurrencyFieldInput = z.infer<typeof updateCurrencyFieldSchema>

export const currencyFieldQuerySchema = baseFieldQuerySchema.merge(currencyTypeObjectSchema)
export type ICurrencyFieldQuerySchema = z.infer<typeof currencyFieldQuerySchema>

export const currencyFieldValue = z.number().nonnegative().nullable()
export type ICurrencyFieldValue = z.infer<typeof currencyFieldValue>

export const createCurrencyFieldValue = currencyFieldValue
export type ICreateCurrencyFieldValue = z.infer<typeof createCurrencyFieldValue>

export const currencyFieldQueryValue = currencyFieldValue
export type ICurrencyFieldQueryValue = z.infer<typeof currencyFieldQueryValue>

export const createCurrencyFieldValue_internal = z
  .object({ value: createCurrencyFieldValue })
  .merge(currencyTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(CurrencyField) }))
export type ICreateCurrencyFieldValue_internal = z.infer<typeof createCurrencyFieldValue_internal>
