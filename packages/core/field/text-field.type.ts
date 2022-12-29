import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'
import { TextField } from './text.field'

export const textTypeSchema = z.literal('text')
export type TextFieldType = z.infer<typeof textTypeSchema>
const textTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: textTypeSchema })

export const createTextFieldSchema = createBaseFieldsSchema.merge(textTypeObjectSchema)
export type ICreateTextFieldInput = z.infer<typeof createTextFieldSchema>

export const textFieldQuerySchema = baseFieldQuerySchema.merge(textTypeObjectSchema)

export const textFieldValue = z.string().nullable()
export type ITextFieldValue = z.infer<typeof textFieldValue>

export const createTextFieldValue = textFieldValue
export type ICreateTextFieldValue = z.infer<typeof createTextFieldValue>

export const createTextFieldValue_internal = z
  .object({ value: createTextFieldValue })
  .merge(textTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(TextField) }))
export type ICreateTextFieldValue_internal = z.infer<typeof createTextFieldValue_internal>
