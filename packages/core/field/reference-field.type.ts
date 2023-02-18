import * as z from 'zod'
import { recordIdSchema } from '../record/value-objects/record-id.schema.js'
import { baseFieldQuerySchema, createBaseFieldsSchema, updateBaseFieldSchema } from './field.base.js'
import { FIELD_TYPE_KEY } from './field.constant.js'
import { ReferenceField } from './reference-field.js'

export const referenceTypeSchema = z.literal('reference')
export type ReferenceFieldType = z.infer<typeof referenceTypeSchema>
const referenceTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: referenceTypeSchema })

export const createReferenceFieldSchema = createBaseFieldsSchema.merge(referenceTypeObjectSchema)
export type ICreateReferenceFieldInput = z.infer<typeof createReferenceFieldSchema>

export const updateReferenceFieldSchema = updateBaseFieldSchema.merge(referenceTypeObjectSchema)
export type IUpdateReferenceFieldInput = z.infer<typeof updateReferenceFieldSchema>

export const referenceFieldQuerySchema = baseFieldQuerySchema.merge(referenceTypeObjectSchema)

export const referenceFieldValue = recordIdSchema.array().nullable()
export type IReferenceFieldValue = z.infer<typeof referenceFieldValue>

export const createReferenceFieldValue = referenceFieldValue
export type ICreateReferenceFieldValue = z.infer<typeof createReferenceFieldValue>

export const referenceFieldQueryValue = referenceFieldValue
export type IReferenceFieldQueryValue = z.infer<typeof referenceFieldQueryValue>

export const createReferenceFieldValue_internal = z
  .object({ value: createReferenceFieldValue })
  .merge(referenceTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(ReferenceField) }))
export type ICreateReferenceFieldValue_internal = z.infer<typeof createReferenceFieldValue_internal>
