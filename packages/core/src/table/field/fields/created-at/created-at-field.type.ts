import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { BaseDateField, IBaseField } from '../../field.type.js'
import { timeFormat } from '../../value-objects/time-format.vo.js'
import { CreatedAtField } from './created-at-field.js'

export const createdAtTypeSchema = z.literal('created-at')
export type CreatedAtFieldType = z.infer<typeof createdAtTypeSchema>
const createdAtTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: createdAtTypeSchema })
const createdAtObjectSchema = z.object({ format: z.string().optional(), timeFormat: timeFormat.optional() })

export const createCreatedAtFieldSchema = createBaseFieldSchema
  .merge(createdAtTypeObjectSchema)
  .merge(createdAtObjectSchema)

export type ICreateCreatedAtFieldInput = z.infer<typeof createCreatedAtFieldSchema>

export const updateCreatedAtFieldSchema = updateBaseFieldSchema
  .merge(createdAtTypeObjectSchema)
  .merge(createdAtObjectSchema)
export type IUpdateCreatedAtFieldInput = z.infer<typeof updateCreatedAtFieldSchema>

export const createdAtFieldQuerySchema = baseFieldQuerySchema
  .merge(createdAtTypeObjectSchema)
  .merge(createdAtObjectSchema)
export type ICreatedAtFieldQuerySchema = z.infer<typeof createdAtFieldQuerySchema>

export const createdAtFieldValue = z.date()
export type ICreatedAtFieldValue = z.infer<typeof createdAtFieldValue>

export const createCreatedAtFieldValue = createdAtFieldValue
export type ICreateCreatedAtFieldValue = z.infer<typeof createCreatedAtFieldValue>

export const createdAtFieldQueryValue = z.string()
export type ICreatedAtFieldQueryValue = z.infer<typeof createdAtFieldQueryValue>

export const createCreatedAtFieldValue_internal = z
  .object({ value: createCreatedAtFieldValue })
  .merge(createdAtTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(CreatedAtField) }))
export type ICreateCreatedAtFieldValue_internal = z.infer<typeof createCreatedAtFieldValue_internal>

export const createdAtReadableValueSchema = createdAtFieldQueryValue

export type ICreatedAtField = IBaseField & BaseDateField
