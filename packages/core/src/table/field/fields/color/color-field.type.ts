import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { ColorField } from './color-field.js'

export const colorTypeSchema = z.literal('color')
export type ColorFieldType = z.infer<typeof colorTypeSchema>
const colorTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: colorTypeSchema })

export const createColorFieldSchema = createBaseFieldSchema.merge(colorTypeObjectSchema)
export type ICreateColorFieldInput = z.infer<typeof createColorFieldSchema>

export const updateColorFieldSchema = updateBaseFieldSchema.merge(colorTypeObjectSchema)
export type IUpdateColorFieldInput = z.infer<typeof updateColorFieldSchema>

export const colorFieldQuerySchema = baseFieldQuerySchema.merge(colorTypeObjectSchema)
export type IColorFieldQuerySchema = z.infer<typeof colorFieldQuerySchema>

export const colorFieldValue = z.string().min(4).max(9).regex(/^#/).nullable()
export type IColorFieldValue = z.infer<typeof colorFieldValue>

export const createColorFieldValue = colorFieldValue
export type ICreateColorFieldValue = z.infer<typeof createColorFieldValue>

export const colorFieldQueryValue = colorFieldValue
export type IColorFieldQueryValue = z.infer<typeof colorFieldQueryValue>

export const createColorFieldValue_internal = z
  .object({ value: createColorFieldValue })
  .merge(colorTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(ColorField) }))
export type ICreateColorFieldValue_internal = z.infer<typeof createColorFieldValue_internal>

export const colorReadableValueSchema = colorFieldQueryValue

export type IColorField = IBaseField
