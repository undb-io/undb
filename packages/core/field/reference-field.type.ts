import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'
import { ReferenceField } from './reference-field'

export const referenceTypeSchema = z.literal('reference')
export type ReferenceFieldType = z.infer<typeof referenceTypeSchema>
const referenceTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: referenceTypeSchema })

export const createReferenceFieldSchema = createBaseFieldsSchema.merge(referenceTypeObjectSchema)
export type ICreateReferenceFieldInput = z.infer<typeof createReferenceFieldSchema>

export const referenceFieldQuerySchema = baseFieldQuerySchema.merge(referenceTypeObjectSchema)

export const referenceFieldValue = z.null()
export type IReferenceFieldValue = z.infer<typeof referenceFieldValue>

export const createReferenceFieldValue = referenceFieldValue
export type ICreateReferenceFieldValue = z.infer<typeof createReferenceFieldValue>

export const createReferenceFieldValue_internal = z
  .object({ value: createReferenceFieldValue })
  .merge(referenceTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(ReferenceField) }))
export type ICreateReferenceFieldValue_internal = z.infer<typeof createReferenceFieldValue_internal>
