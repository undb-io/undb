import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { EmailField } from './email-field.js'

export const emailTypeSchema = z.literal('email')
export type EmailFieldType = z.infer<typeof emailTypeSchema>
const emailTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: emailTypeSchema })

export const createEmailFieldSchema = createBaseFieldSchema.merge(emailTypeObjectSchema)
export type ICreateEmailFieldInput = z.infer<typeof createEmailFieldSchema>

export const updateEmailFieldSchema = updateBaseFieldSchema.merge(emailTypeObjectSchema)
export type IUpdateEmailFieldInput = z.infer<typeof updateEmailFieldSchema>

export const emailFieldQuerySchema = baseFieldQuerySchema.merge(emailTypeObjectSchema)
export type IEmailFieldQuerySchema = z.infer<typeof emailFieldQuerySchema>

export const emailFieldValue = z.string().email().nullable().or(z.string().length(0))
export type IEmailFieldValue = z.infer<typeof emailFieldValue>

export const createEmailFieldValue = emailFieldValue
export type ICreateEmailFieldValue = z.infer<typeof createEmailFieldValue>

export const emailFieldQueryValue = emailFieldValue
export type IEmailFieldQueryValue = z.infer<typeof emailFieldQueryValue>

export const createEmailFieldValue_internal = z
  .object({ value: createEmailFieldValue })
  .merge(emailTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(EmailField) }))
export type ICreateEmailFieldValue_internal = z.infer<typeof createEmailFieldValue_internal>

export const emailReadableValueSchema = emailFieldQueryValue

export type IEmailField = IBaseField
