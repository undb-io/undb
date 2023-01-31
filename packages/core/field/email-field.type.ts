import * as z from 'zod'
import { EmailField } from './email-field'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'

export const emailTypeSchema = z.literal('email')
export type EmailFieldType = z.infer<typeof emailTypeSchema>
const emailTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: emailTypeSchema })

export const createEmailFieldSchema = createBaseFieldsSchema.merge(emailTypeObjectSchema)
export type ICreateEmailFieldInput = z.infer<typeof createEmailFieldSchema>

export const emailFieldQuerySchema = baseFieldQuerySchema.merge(emailTypeObjectSchema)

export const emailFieldValue = z.string().email().nullable()
export type IEmailFieldValue = z.infer<typeof emailFieldValue>

export const createEmailFieldValue = emailFieldValue
export type ICreateEmailFieldValue = z.infer<typeof createEmailFieldValue>

export const createEmailFieldValue_internal = z
  .object({ value: createEmailFieldValue })
  .merge(emailTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(EmailField) }))
export type ICreateEmailFieldValue_internal = z.infer<typeof createEmailFieldValue_internal>
