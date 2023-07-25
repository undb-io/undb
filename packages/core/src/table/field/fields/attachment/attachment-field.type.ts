import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { AttachmentField } from './attachment-field.js'

export const attachmentTypeSchema = z.literal('attachment')
export type AttachmentFieldType = z.infer<typeof attachmentTypeSchema>
const attachmentTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: attachmentTypeSchema })

export const createAttachmentFieldSchema = createBaseFieldSchema.merge(attachmentTypeObjectSchema)
export type ICreateAttachmentFieldInput = z.infer<typeof createAttachmentFieldSchema>

export const updateAttachmentFieldSchema = updateBaseFieldSchema.merge(attachmentTypeObjectSchema)
export type IUpdateAttachmentFieldInput = z.infer<typeof updateAttachmentFieldSchema>

export const attachmentFieldQuerySchema = baseFieldQuerySchema.merge(attachmentTypeObjectSchema)
export type IAttachmentFieldQuerySchema = z.infer<typeof attachmentFieldQuerySchema>

export const attachmentItem = z
  .object({
    name: z.string(),
    size: z.number().nonnegative(),
    mimeType: z.string(),
    id: z.string(),
    token: z.string(),
    url: z.string(),
  })
  .strict()
export type IAttachmentItem = z.infer<typeof attachmentItem>

export const attachmentFieldValue = attachmentItem.array()
export type IAttachmentFieldValue = z.infer<typeof attachmentFieldValue>

export const createAttachmentFieldValue = attachmentFieldValue
export type ICreateAttachmentFieldValue = z.infer<typeof createAttachmentFieldValue>

export const attachmentFieldQueryValue = attachmentFieldValue
export type IAttachmentFieldQueryValue = z.infer<typeof attachmentFieldQueryValue>

export const createAttachmentFieldValue_internal = z
  .object({ value: createAttachmentFieldValue })
  .merge(attachmentTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(AttachmentField) }))
export type ICreateAttachmentFieldValue_internal = z.infer<typeof createAttachmentFieldValue_internal>

export const attachmentReadableValueSchema = attachmentFieldQueryValue

export type IAttachmentReadableValueSchema = z.infer<typeof attachmentReadableValueSchema>

export type IAttachmentField = IBaseField
