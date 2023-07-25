import * as z from 'zod'
import { recordIdSchema } from '../../../record/value-objects/record-id.schema.js'
import type { TableId } from '../../../value-objects/table-id.vo.js'
import { tableIdSchema } from '../../../value-objects/table-id.vo.js'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import type { DisplayFields } from '../../value-objects/display-fields.vo.js'
import { fieldIdSchema } from '../../value-objects/field-id.schema.js'
import type { FieldId } from '../../value-objects/field-id.vo.js'
import type { FieldIssue } from '../../value-objects/field-issue.vo.js'
import { ReferenceField } from './reference-field.js'

export const referenceTypeSchema = z.literal('reference')
export type ReferenceFieldType = z.infer<typeof referenceTypeSchema>
const referenceTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: referenceTypeSchema })

export const createReferenceFieldSchema = createBaseFieldSchema.merge(referenceTypeObjectSchema).merge(
  z.object({
    displayFieldIds: fieldIdSchema.array().optional(),
    foreignTableId: tableIdSchema.optional(),
    bidirectional: z.boolean().optional(),
    symmetricReferenceFieldId: fieldIdSchema.optional(),
  }),
)
export type ICreateReferenceFieldInput = z.infer<typeof createReferenceFieldSchema>

export const updateReferenceFieldSchema = updateBaseFieldSchema.merge(referenceTypeObjectSchema).merge(
  z.object({
    foreignTableId: tableIdSchema.optional(),
    displayFieldIds: fieldIdSchema.array().optional(),
  }),
)
export type IUpdateReferenceFieldInput = z.infer<typeof updateReferenceFieldSchema>

export const referenceFieldQuerySchema = baseFieldQuerySchema.merge(referenceTypeObjectSchema).merge(
  z.object({
    foreignTableId: tableIdSchema.optional(),
    displayFieldIds: fieldIdSchema.array().optional(),
    symmetricReferenceFieldId: fieldIdSchema.optional(),
    bidirectional: z.boolean(),
  }),
)
export type IReferenceFieldQuerySchema = z.infer<typeof referenceFieldQuerySchema>

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

export const referenceFieldIssues = z.enum(['Missing Foreign Table'])
export type IReferenceFieldIssues = z.infer<typeof referenceFieldIssues>

export type ReferenceFieldIssue = FieldIssue<IReferenceFieldIssues>

export const referenceReadableValueSchema = z
  .object({
    id: recordIdSchema,
    value: z.any().array(),
  })
  .array()

export type IReferenceReadableValueSchema = z.infer<typeof referenceReadableValueSchema>

export type IReferenceField = IBaseField & {
  displayFields?: DisplayFields
  foreignTableId?: TableId
  isOwner?: boolean
  symmetricReferenceFieldId?: FieldId
}
