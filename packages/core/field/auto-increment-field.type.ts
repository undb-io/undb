import * as z from 'zod'
import { AutoIncrementField } from './auto-increment-field'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'

export const autoIncrementTypeSchema = z.literal('auto-increment')
export type AutoIncrementFieldType = z.infer<typeof autoIncrementTypeSchema>
const autoIncrementTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: autoIncrementTypeSchema })

export const createAutoIncrementFieldSchema = createBaseFieldsSchema.merge(autoIncrementTypeObjectSchema)
export type ICreateAutoIncrementFieldInput = z.infer<typeof createAutoIncrementFieldSchema>

export const autoIncrementFieldQuerySchema = baseFieldQuerySchema.merge(autoIncrementTypeObjectSchema)

export const autoIncrementFieldValue = z.number().int().positive()
export type IAutoIncrementFieldValue = z.infer<typeof autoIncrementFieldValue>

export const createAutoIncrementFieldValue = autoIncrementFieldValue
export type ICreateAutoIncrementFieldValue = z.infer<typeof createAutoIncrementFieldValue>

export const autoIncrementQueryValue = autoIncrementFieldValue
export type IAutoIncrementQueryValue = z.infer<typeof autoIncrementQueryValue>

export const createAutoIncrementFieldValue_internal = z
  .object({ value: createAutoIncrementFieldValue })
  .merge(autoIncrementTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(AutoIncrementField) }))
export type ICreateAutoIncrementFieldValue_internal = z.infer<typeof createAutoIncrementFieldValue_internal>
