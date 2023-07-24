import * as z from 'zod'
import { colorsSchema } from '../../../../common/color.js'
import { userIdSchema } from '../../../../user/value-objects/user-id.vo.js'
import { tableIdSchema } from '../../../value-objects/table-id.vo.js'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { fieldIdSchema } from '../../value-objects/field-id.schema.js'
import type { FieldIssue } from '../../value-objects/field-issue.vo.js'
import { CollaboratorField } from './collaborator-field.js'

export const collaboratorTypeSchema = z.literal('collaborator')
export type CollaboratorFieldType = z.infer<typeof collaboratorTypeSchema>
const collaboratorTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: collaboratorTypeSchema })

export const createCollaboratorFieldSchema = createBaseFieldSchema.merge(collaboratorTypeObjectSchema).merge(
  z.object({
    displayFieldIds: fieldIdSchema.array().optional(),
    foreignTableId: tableIdSchema.optional(),
    bidirectional: z.boolean().optional(),
    symmetricCollaboratorFieldId: fieldIdSchema.optional(),
  }),
)
export type ICreateCollaboratorFieldInput = z.infer<typeof createCollaboratorFieldSchema>

export const updateCollaboratorFieldSchema = updateBaseFieldSchema.merge(collaboratorTypeObjectSchema).merge(
  z.object({
    displayFieldIds: fieldIdSchema.array().optional(),
  }),
)
export type IUpdateCollaboratorFieldInput = z.infer<typeof updateCollaboratorFieldSchema>

export const collaboratorFieldQuerySchema = baseFieldQuerySchema.merge(collaboratorTypeObjectSchema).merge(
  z.object({
    foreignTableId: tableIdSchema.optional(),
    displayFieldIds: fieldIdSchema.array().optional(),
    symmetricCollaboratorFieldId: fieldIdSchema.optional(),
  }),
)
export type ICollaboratorFieldQuerySchema = z.infer<typeof collaboratorFieldQuerySchema>

export const collaboratorFieldValue = userIdSchema.array().nullable()
export type ICollaboratorFieldValue = z.infer<typeof collaboratorFieldValue>

export const createCollaboratorFieldValue = collaboratorFieldValue
export type ICreateCollaboratorFieldValue = z.infer<typeof createCollaboratorFieldValue>

export const collaboratorFieldQueryValue = collaboratorFieldValue
export type ICollaboratorFieldQueryValue = z.infer<typeof collaboratorFieldQueryValue>

export const createCollaboratorFieldValue_internal = z
  .object({ value: createCollaboratorFieldValue })
  .merge(collaboratorTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(CollaboratorField) }))
export type ICreateCollaboratorFieldValue_internal = z.infer<typeof createCollaboratorFieldValue_internal>

export const collaboratorFieldIssues = z.enum(['Missing Foreign Table'])
export type ICollaboratorFieldIssues = z.infer<typeof collaboratorFieldIssues>

export type CollaboratorFieldIssue = FieldIssue<ICollaboratorFieldIssues>

export const collaboratorProfile = z.object({
  avatar: z.string().nullable(),
  username: z.string(),
  color: colorsSchema,
})

export type ICollaboratorProfile = z.infer<typeof collaboratorProfile>

export const collaboratorReadableValueSchema = z.object({ id: userIdSchema }).merge(collaboratorProfile).array()

export type ICollaboratorReadableValueSchema = z.infer<typeof collaboratorReadableValueSchema>

export type ICollaboratorField = IBaseField
