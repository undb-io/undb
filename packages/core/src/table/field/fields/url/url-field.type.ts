import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { UrlField } from './url-field.js'

export const urlTypeSchema = z.literal('url')
export type UrlFieldType = z.infer<typeof urlTypeSchema>
const urlTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: urlTypeSchema })

export const createUrlFieldSchema = createBaseFieldSchema.merge(urlTypeObjectSchema)
export type ICreateUrlFieldInput = z.infer<typeof createUrlFieldSchema>

export const updateUrlFieldSchema = updateBaseFieldSchema.merge(urlTypeObjectSchema)
export type IUpdateUrlFieldInput = z.infer<typeof updateUrlFieldSchema>

export const urlFieldQuerySchema = baseFieldQuerySchema.merge(urlTypeObjectSchema)
export type IUrlFieldQuerySchema = z.infer<typeof urlFieldQuerySchema>

export const urlFieldValue = z.string().url().nullable().or(z.string().length(0))
export type IUrlFieldValue = z.infer<typeof urlFieldValue>

export const createUrlFieldValue = urlFieldValue
export type ICreateUrlFieldValue = z.infer<typeof createUrlFieldValue>

export const urlFieldQueryValue = urlFieldValue
export type IUrlFieldQueryValue = z.infer<typeof urlFieldQueryValue>

export const createUrlFieldValue_internal = z
  .object({ value: createUrlFieldValue })
  .merge(urlTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(UrlField) }))
export type ICreateUrlFieldValue_internal = z.infer<typeof createUrlFieldValue_internal>

export const urlReadableValueSchema = urlFieldQueryValue

export type IUrlField = IBaseField
