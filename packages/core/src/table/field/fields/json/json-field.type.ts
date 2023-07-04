import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { JsonField } from './json-field.js'

export const jsonTypeSchema = z.literal('json')
export type JsonFieldType = z.infer<typeof jsonTypeSchema>
const jsonTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: jsonTypeSchema })

export const createJsonFieldSchema = createBaseFieldSchema.merge(jsonTypeObjectSchema)
export type ICreateJsonFieldInput = z.infer<typeof createJsonFieldSchema>

export const updateJsonFieldSchema = updateBaseFieldSchema.merge(jsonTypeObjectSchema)
export type IUpdateJsonFieldInput = z.infer<typeof updateJsonFieldSchema>

export const jsonFieldQuerySchema = baseFieldQuerySchema.merge(jsonTypeObjectSchema)
export type IJsonFieldQuerySchema = z.infer<typeof jsonFieldQuerySchema>

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
export type Json = Literal | { [key: string]: Json } | Json[]

export const jsonFieldValue: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonFieldValue), z.record(jsonFieldValue)]),
)

export type IJsonFieldValue = z.infer<typeof jsonFieldValue>

export const createJsonFieldValue = jsonFieldValue
export type ICreateJsonFieldValue = z.infer<typeof createJsonFieldValue>

export const jsonFieldQueryValue = jsonFieldValue
export type IJsonFieldQueryValue = z.infer<typeof jsonFieldQueryValue>

export const createJsonFieldValue_internal = z
  .object({ value: createJsonFieldValue })
  .merge(jsonTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(JsonField) }))
export type ICreateJsonFieldValue_internal = z.infer<typeof createJsonFieldValue_internal>

export const jsonReadableValueSchema = z.record(z.any()).or(z.array(z.any())).or(z.string()).or(z.null()).or(z.number())

export type IJsonField = IBaseField
