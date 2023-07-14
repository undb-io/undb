import * as z from 'zod'
import { userIdSchema } from '../../../../user/value-objects/user-id.vo.js'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { collaboratorProfile } from '../collaborator/collaborator-field.type.js'
import { CreatedByField } from './created-by-field.js'

export const createdByTypeSchema = z.literal('created-by')
export type CreatedByFieldType = z.infer<typeof createdByTypeSchema>
const createdByTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: createdByTypeSchema })
const createdByObjectSchema = z.object({ format: z.string().optional() })

export const createCreatedByFieldSchema = createBaseFieldSchema
  .merge(createdByTypeObjectSchema)
  .merge(createdByObjectSchema)

export type ICreateCreatedByFieldInput = z.infer<typeof createCreatedByFieldSchema>

export const updateCreatedByFieldSchema = updateBaseFieldSchema
  .merge(createdByTypeObjectSchema)
  .merge(createdByObjectSchema)
export type IUpdateCreatedByFieldInput = z.infer<typeof updateCreatedByFieldSchema>

export const createdByFieldQuerySchema = baseFieldQuerySchema
  .merge(createdByTypeObjectSchema)
  .merge(createdByObjectSchema)
export type ICreatedByFieldQuerySchema = z.infer<typeof createdByFieldQuerySchema>

export const createdByFieldValue = userIdSchema
export type ICreatedByFieldValue = z.infer<typeof createdByFieldValue>

export const createCreatedByFieldValue = createdByFieldValue
export type ICreateCreatedByFieldValue = z.infer<typeof createCreatedByFieldValue>

export const createdByFieldQueryValue = z.string()
export type ICreatedByFieldQueryValue = z.infer<typeof createdByFieldQueryValue>

export const createCreatedByFieldValue_internal = z
  .object({ value: createCreatedByFieldValue })
  .merge(createdByTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(CreatedByField) }))
export type ICreateCreatedByFieldValue_internal = z.infer<typeof createCreatedByFieldValue_internal>

export const createdByReadableValueSchema = z.object({ id: userIdSchema }).merge(collaboratorProfile)

export type ICreatedByField = IBaseField
