import { isAfter } from 'date-fns'
import { z } from 'zod'
import { DateRangeField } from './date-range-field.js'
import { baseFieldQuerySchema, createBaseFieldsSchema, updateBaseFieldSchema } from './field-base.schema'
import { FIELD_TYPE_KEY } from './field.constant.js'

export const dateRangeTypeSchema = z.literal('date-range')
export type DateRangeType = z.infer<typeof dateRangeTypeSchema>
const dateRangeTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: dateRangeTypeSchema })

export const createDateRangeFieldSchema = createBaseFieldsSchema.merge(dateRangeTypeObjectSchema)
export type ICreateDateRangeFieldSchema = z.infer<typeof createDateRangeFieldSchema>

export const updateDateRangeFieldSchema = updateBaseFieldSchema.merge(dateRangeTypeObjectSchema)
export type IUpdateDateRangeFieldInput = z.infer<typeof updateDateRangeFieldSchema>

export const dateRangeFieldQuerySchema = baseFieldQuerySchema.merge(dateRangeTypeObjectSchema)

export const dateRangeFieldValue = z
  .tuple([z.date().nullable(), z.date().nullable()])
  .nullable()
  .refine(
    (checker) => {
      if (checker) {
        const [from, to] = checker
        if (from && to) {
          return isAfter(to, from)
        }
        return true
      }
      return true
    },
    { message: 'date range value from should before value to' },
  )

export type IDateRangeFieldValue = z.infer<typeof dateRangeFieldValue>

export const createDateRangeFieldValue = dateRangeFieldValue
export type ICreateDateRangeFieldValue = z.infer<typeof createDateRangeFieldValue>

export const dateRangeFieldQueryValue = dateRangeFieldValue
export type IDateRangeFieldQueryValue = z.infer<typeof dateRangeFieldQueryValue>

export const createDateRangeFieldValue_internal = z
  .object({ value: createDateRangeFieldValue })
  .merge(dateRangeTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(DateRangeField) }))

export type ICreateDateRangeFieldValue_internal = z.infer<typeof createDateRangeFieldValue_internal>

export const isDateRangeField = z.instanceof(DateRangeField)
