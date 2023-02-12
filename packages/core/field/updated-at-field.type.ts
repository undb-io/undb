import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base.js'
import { FIELD_TYPE_KEY } from './field.constant.js'
import { UpdatedAtField } from './updated-at-field.js'

export const updatedAtTypeSchema = z.literal('updated-at')
export type UpdatedAtFieldType = z.infer<typeof updatedAtTypeSchema>
const updatedAtTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: updatedAtTypeSchema })

export const createUpdatedAtFieldSchema = createBaseFieldsSchema.merge(updatedAtTypeObjectSchema)
export type ICreateUpdatedAtFieldInput = z.infer<typeof createUpdatedAtFieldSchema>

export const updatedAtFieldQuerySchema = baseFieldQuerySchema.merge(updatedAtTypeObjectSchema)

export const updatedAtFieldValue = z.date()
export type IUpdatedAtFieldValue = z.infer<typeof updatedAtFieldValue>

export const createUpdatedAtFieldValue = updatedAtFieldValue
export type ICreateUpdatedAtFieldValue = z.infer<typeof createUpdatedAtFieldValue>

export const updatedAtFieldQueryValue = updatedAtFieldValue
export type IUpdatedAtFieldQueryValue = z.infer<typeof updatedAtFieldQueryValue>

export const createUpdatedAtFieldValue_internal = z
  .object({ value: createUpdatedAtFieldValue })
  .merge(updatedAtTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(UpdatedAtField) }))
export type ICreateUpdatedAtFieldValue_internal = z.infer<typeof createUpdatedAtFieldValue_internal>
