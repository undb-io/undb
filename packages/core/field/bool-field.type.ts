import * as z from 'zod'
import { BoolField } from './bool-field'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'

export const boolTypeSchema = z.literal('bool')
export type BoolFieldType = z.infer<typeof boolTypeSchema>
const boolTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: boolTypeSchema })

export const createBoolFieldSchema = createBaseFieldsSchema.merge(boolTypeObjectSchema)
export type ICreateBoolFieldInput = z.infer<typeof createBoolFieldSchema>

export const boolFieldQuerySchema = baseFieldQuerySchema.merge(boolTypeObjectSchema)

export const boolFieldValue = z.boolean()
export type IBoolFieldValue = z.infer<typeof boolFieldValue>

export const createBoolFieldValue = boolFieldValue
export type ICreateBoolFieldValue = z.infer<typeof createBoolFieldValue>

export const createBoolFieldValue_internal = z
  .object({ value: createBoolFieldValue })
  .merge(boolTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(BoolField) }))
export type ICreateBoolFieldValue_internal = z.infer<typeof createBoolFieldValue_internal>
