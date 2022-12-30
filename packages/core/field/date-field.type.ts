import { z } from 'zod'
import { DateField } from './date-field'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'

export const dateTypeSchema = z.literal('date')
export type DateType = z.infer<typeof dateTypeSchema>
const dateTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: dateTypeSchema })

export const createDateFieldSchema = createBaseFieldsSchema.merge(dateTypeObjectSchema)
export type ICreateDateFieldSchema = z.infer<typeof createDateFieldSchema>

export const dateFieldQuerySchema = baseFieldQuerySchema.merge(dateTypeObjectSchema)

export const dateFieldValue = z.date().or(z.null())
export type IDateFieldValue = z.infer<typeof dateFieldValue>

export const createDateFieldValue = dateFieldValue
export type ICreateDateFieldValue = z.infer<typeof createDateFieldValue>

export const createDateFieldValue_internal = z
  .object({ value: createDateFieldValue })
  .merge(dateTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(DateField) }))

export type ICreateDateFieldValue_internal = z.infer<typeof createDateFieldValue_internal>
