import * as z from 'zod'
import { recordIdSchema } from '../record/value-objects/record-id.schema.js'
import { baseFieldQuerySchema, createBaseFieldsSchema, updateBaseFieldSchema } from './field-base.schema'
import { FIELD_TYPE_KEY } from './field.constant.js'
import { ParentField } from './parent-field.js'
import { fieldIdSchema } from './value-objects/field-id.schema.js'

export const parentTypeSchema = z.literal('parent')
export type ParentFieldType = z.infer<typeof parentTypeSchema>
const parentTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: parentTypeSchema })

export const createParentFieldSchema = createBaseFieldsSchema.merge(parentTypeObjectSchema).merge(
  z.object({
    treeFieldId: fieldIdSchema,
    displayFieldIds: fieldIdSchema.array().optional(),
  }),
)
export type ICreateParentFieldInput = z.infer<typeof createParentFieldSchema>

export const updateParentFieldSchema = updateBaseFieldSchema.merge(parentTypeObjectSchema).merge(
  z.object({
    displayFieldIds: fieldIdSchema.array().optional(),
  }),
)
export type IUpdateParentFieldInput = z.infer<typeof updateParentFieldSchema>

export const parentFieldQuerySchema = baseFieldQuerySchema.merge(parentTypeObjectSchema).merge(
  z.object({
    treeFieldId: fieldIdSchema,
    displayFieldIds: fieldIdSchema.array().optional(),
  }),
)
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
