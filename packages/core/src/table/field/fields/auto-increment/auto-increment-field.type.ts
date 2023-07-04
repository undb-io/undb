import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { AutoIncrementField } from './auto-increment-field.js'

export const autoIncrementTypeSchema = z.literal('auto-increment')
export type AutoIncrementFieldType = z.infer<typeof autoIncrementTypeSchema>
const autoIncrementTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: autoIncrementTypeSchema })

export const createAutoIncrementFieldSchema = createBaseFieldSchema.merge(autoIncrementTypeObjectSchema)
export type ICreateAutoIncrementFieldInput = z.infer<typeof createAutoIncrementFieldSchema>

export const updateAutoIncrementFieldSchema = updateBaseFieldSchema.merge(autoIncrementTypeObjectSchema)
export type IUpdateAutoIncrementFieldInput = z.infer<typeof updateAutoIncrementFieldSchema>

export const autoIncrementFieldQuerySchema = baseFieldQuerySchema.merge(autoIncrementTypeObjectSchema)
export type IAutoIncrementFieldQuerySchema = z.infer<typeof autoIncrementFieldQuerySchema>

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

export const autoIncrementReadableValueSchema = autoIncrementQueryValue

export type IAutoIncrementField = IBaseField
