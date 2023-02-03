import * as z from 'zod'
import { CreatedAtField } from './created-at-field'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'

export const createdAtTypeSchema = z.literal('created-at')
export type CreatedAtFieldType = z.infer<typeof createdAtTypeSchema>
const createdAtTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: createdAtTypeSchema })

export const createCreatedAtFieldSchema = createBaseFieldsSchema.merge(createdAtTypeObjectSchema)
export type ICreateCreatedAtFieldInput = z.infer<typeof createCreatedAtFieldSchema>

export const createdAtFieldQuerySchema = baseFieldQuerySchema.merge(createdAtTypeObjectSchema)

export const createdAtFieldValue = z.date()
export type ICreatedAtFieldValue = z.infer<typeof createdAtFieldValue>

export const createCreatedAtFieldValue = createdAtFieldValue
export type ICreateCreatedAtFieldValue = z.infer<typeof createCreatedAtFieldValue>

export const createdAtFieldQueryValue = createdAtFieldValue
export type ICreatedAtFieldQueryValue = z.infer<typeof createdAtFieldQueryValue>

export const createCreatedAtFieldValue_internal = z
  .object({ value: createCreatedAtFieldValue })
  .merge(createdAtTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(CreatedAtField) }))
export type ICreateCreatedAtFieldValue_internal = z.infer<typeof createCreatedAtFieldValue_internal>
