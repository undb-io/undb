import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { StringField } from './string-field.js'

export const stringTypeSchema = z.literal('string')
export type StringFieldType = z.infer<typeof stringTypeSchema>
const stringTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: stringTypeSchema })

export const createStringFieldSchema = createBaseFieldSchema.merge(stringTypeObjectSchema)
export type ICreateStringFieldInput = z.infer<typeof createStringFieldSchema>

export const updateStringFieldSchema = updateBaseFieldSchema.merge(stringTypeObjectSchema)
export type IUpdateStringFieldInput = z.infer<typeof updateStringFieldSchema>

export const stringFieldQuerySchema = baseFieldQuerySchema.merge(stringTypeObjectSchema)
export type IStringFieldQuerySchema = z.infer<typeof stringFieldQuerySchema>

export const stringFieldValue = z.string().nullable()
export type IStringFieldValue = z.infer<typeof stringFieldValue>

export const createStringFieldValue = stringFieldValue
export type ICreateStringFieldValue = z.infer<typeof createStringFieldValue>

export const stringFieldQueryValue = stringFieldValue
export type IStringFieldQueryValue = z.infer<typeof stringFieldQueryValue>

export const createStringFieldValue_internal = z
  .object({ value: createStringFieldValue })
  .merge(stringTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(StringField) }))
export type ICreateStringFieldValue_internal = z.infer<typeof createStringFieldValue_internal>

export const stringReadableValueSchema = stringFieldQueryValue

export type IStringField = IBaseField
