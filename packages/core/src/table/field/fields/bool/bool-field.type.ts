import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { BoolField } from './bool-field.js'

export const boolTypeSchema = z.literal('bool')
export type BoolFieldType = z.infer<typeof boolTypeSchema>
const boolTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: boolTypeSchema })

export const createBoolFieldSchema = createBaseFieldSchema.merge(boolTypeObjectSchema)
export type ICreateBoolFieldInput = z.infer<typeof createBoolFieldSchema>

export const updateBoolFieldSchema = updateBaseFieldSchema.merge(boolTypeObjectSchema)
export type IUpdateBoolFieldInput = z.infer<typeof updateBoolFieldSchema>

export const boolFieldQuerySchema = baseFieldQuerySchema.merge(boolTypeObjectSchema)
export type IBoolFieldQuerySchema = z.infer<typeof boolFieldQuerySchema>

export const boolFieldValue = z.boolean()
export type IBoolFieldValue = z.infer<typeof boolFieldValue>

export const createBoolFieldValue = boolFieldValue
export type ICreateBoolFieldValue = z.infer<typeof createBoolFieldValue>

export const boolFieldQueryValue = boolFieldValue
export type IBoolFieldQueryValue = z.infer<typeof boolFieldQueryValue>

export const createBoolFieldValue_internal = z
  .object({ value: createBoolFieldValue })
  .merge(boolTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(BoolField) }))
export type ICreateBoolFieldValue_internal = z.infer<typeof createBoolFieldValue_internal>

export const boolReadableValueSchema = boolFieldQueryValue

export type IBoolField = IBaseField
