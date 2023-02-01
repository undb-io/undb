import * as z from 'zod'
import { recordIdSchema } from '../record/value-objects/record-id.schema'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'
import { ParentField } from './parent-field'
import { fieldIdSchema } from './value-objects/field-id.schema'

export const parentTypeSchema = z.literal('parent')
export type ParentFieldType = z.infer<typeof parentTypeSchema>
const parentTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: parentTypeSchema })

export const createParentFieldSchema = createBaseFieldsSchema
  .merge(parentTypeObjectSchema)
  .merge(z.object({ treeFieldId: fieldIdSchema }))
export type ICreateParentFieldInput = z.infer<typeof createParentFieldSchema>

export const parentFieldQuerySchema = baseFieldQuerySchema
  .merge(parentTypeObjectSchema)
  .merge(z.object({ treeFieldId: fieldIdSchema }))
export type IParentFieldQuerySchema = z.infer<typeof parentFieldQuerySchema>

export const parentFieldValue = recordIdSchema.nullable()
export type IParentFieldValue = z.infer<typeof parentFieldValue>

export const createParentFieldValue = parentFieldValue
export type ICreateParentFieldValue = z.infer<typeof createParentFieldValue>

export const parentFieldQueryValue = parentFieldValue
export type IParentFieldQueryValue = z.infer<typeof parentFieldQueryValue>

export const createParentFieldValue_internal = z
  .object({ value: createParentFieldValue })
  .merge(parentTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(ParentField) }))
export type ICreateParentFieldValue_internal = z.infer<typeof createParentFieldValue_internal>
