import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from './field-base.schema.js'
import { FIELD_TYPE_KEY } from './field.constants.js'
import { LookupField } from './lookup-field.js'
import { fieldIdSchema } from './value-objects/field-id.schema.js'

export const lookupTypeSchema = z.literal('lookup')
export type LookupType = z.infer<typeof lookupTypeSchema>
const lookupTypeObjectSchema = z.object({
  [FIELD_TYPE_KEY]: lookupTypeSchema,
})

export const createLookupFieldSchema = createBaseFieldSchema.merge(lookupTypeObjectSchema).merge(
  z.object({
    referenceFieldId: fieldIdSchema,
    displayFieldIds: fieldIdSchema.array().optional(),
  }),
)
export type ICreateLookupFieldInput = z.infer<typeof createLookupFieldSchema>

export const updateLookupFieldSchema = updateBaseFieldSchema.merge(lookupTypeObjectSchema).merge(
  z
    .object({
      referenceFieldId: fieldIdSchema,
      displayFieldIds: fieldIdSchema.array().optional(),
    })
    .partial(),
)

export type IUpdateLookupFieldInput = z.infer<typeof updateLookupFieldSchema>

export const lookupFieldQuerySchema = baseFieldQuerySchema.merge(lookupTypeObjectSchema).merge(
  z.object({
    referenceFieldId: fieldIdSchema,
    displayFieldIds: fieldIdSchema.array(),
  }),
)
export type ILookupFieldQuerySchema = z.infer<typeof lookupFieldQuerySchema>

export const lookupFieldValue = z.string().array().nullable()
export type ILookupFieldValue = z.infer<typeof lookupFieldValue>

export const createLookupFieldValue = lookupFieldValue
export type ICreateLookupFieldValue = z.infer<typeof createLookupFieldValue>

export const lookupFieldQueryValue = lookupFieldValue
export type ILookupFieldQueryValue = z.infer<typeof lookupFieldQueryValue>

export const createLookupFieldValue_internal = z
  .object({ value: createLookupFieldValue })
  .merge(lookupTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(LookupField) }))
export type ICreateLookupFieldValue_internal = z.infer<typeof createLookupFieldValue_internal>
