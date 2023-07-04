import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { BaseDateField, IBaseField } from '../../field.type.js'
import { timeFormat } from '../../value-objects/time-format.vo.js'
import { UpdatedAtField } from './updated-at-field.js'

export const updatedAtTypeSchema = z.literal('updated-at')
export type UpdatedAtFieldType = z.infer<typeof updatedAtTypeSchema>
const updatedAtTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: updatedAtTypeSchema })
const updatedAtObjectSchema = z.object({ format: z.string().optional(), timeFormat: timeFormat.optional() })

export const createUpdatedAtFieldSchema = createBaseFieldSchema
  .merge(updatedAtTypeObjectSchema)
  .merge(updatedAtObjectSchema)
export type ICreateUpdatedAtFieldInput = z.infer<typeof createUpdatedAtFieldSchema>

export const updateUpdatedAtFieldSchema = updateBaseFieldSchema
  .merge(updatedAtTypeObjectSchema)
  .merge(updatedAtObjectSchema)
export type IUpdateUpdatedAtFieldInput = z.infer<typeof updateUpdatedAtFieldSchema>

export const updatedAtFieldQuerySchema = baseFieldQuerySchema
  .merge(updatedAtTypeObjectSchema)
  .merge(updatedAtObjectSchema)
export type IUpdatedAtFieldQuerySchema = z.infer<typeof updatedAtFieldQuerySchema>

export const updatedAtFieldValue = z.date()
export type IUpdatedAtFieldValue = z.infer<typeof updatedAtFieldValue>

export const createUpdatedAtFieldValue = updatedAtFieldValue
export type ICreateUpdatedAtFieldValue = z.infer<typeof createUpdatedAtFieldValue>

export const updatedAtFieldQueryValue = z.string()
export type IUpdatedAtFieldQueryValue = z.infer<typeof updatedAtFieldQueryValue>

export const createUpdatedAtFieldValue_internal = z
  .object({ value: createUpdatedAtFieldValue })
  .merge(updatedAtTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(UpdatedAtField) }))
export type ICreateUpdatedAtFieldValue_internal = z.infer<typeof createUpdatedAtFieldValue_internal>

export const updatedAtReadableValueSchema = updatedAtFieldQueryValue

export type IUpdatedAtField = IBaseField & BaseDateField
