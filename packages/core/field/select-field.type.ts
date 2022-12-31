import * as z from 'zod'
import { createOptionsSchema, optionIdSchema, optionsSchema } from '../option/option.schema'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'
import { SelectField } from './select-field'

export const selectTypeSchema = z.literal('select')
export type SelectFieldType = z.infer<typeof selectTypeSchema>
const selectTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: selectTypeSchema })

export const createSelectFieldSchema = createBaseFieldsSchema.merge(selectTypeObjectSchema).merge(
  z.object({
    options: createOptionsSchema,
  }),
)
export type ICreateSelectFieldSchema = z.infer<typeof createSelectFieldSchema>

export const selectFieldQuerySchema = baseFieldQuerySchema.merge(selectTypeObjectSchema).merge(
  z.object({
    options: optionsSchema,
  }),
)

export const selectFieldValue = optionIdSchema
export type ISelectFieldValue = z.infer<typeof selectFieldValue>

export const createSelectFieldValue = optionIdSchema
export type ICreateSelectFieldValue = z.infer<typeof createSelectFieldValue>

export const createSelectFieldValue_internal = z
  .object({ value: createSelectFieldValue })
  .merge(selectTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(SelectField) }))
export type ICreateSelectFieldValue_internal = z.infer<typeof createSelectFieldValue_internal>

export const reorderOptionsSchema = z.object({
  from: optionIdSchema,
  to: optionIdSchema,
})

export type IReorderOptionsSchema = z.infer<typeof reorderOptionsSchema>
