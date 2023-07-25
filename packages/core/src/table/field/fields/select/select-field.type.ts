import * as z from 'zod'
import {
  createOptionsSchema,
  mutateOptionSchema,
  optionIdSchema,
  optionsSchema,
  readableOptionSchema,
} from '../../../option/option.schema.js'
import type { Options } from '../../../option/options.js'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { fieldIdSchema } from '../../value-objects/field-id.schema.js'
import { SelectField } from './select-field.js'

export const selectTypeSchema = z.literal('select')
export type SelectFieldType = z.infer<typeof selectTypeSchema>
const selectTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: selectTypeSchema })

export const createSelectFieldSchema = createBaseFieldSchema.merge(selectTypeObjectSchema).merge(
  z.object({
    options: createOptionsSchema.min(1),
  }),
)
export type ICreateSelectFieldSchema = z.infer<typeof createSelectFieldSchema>

export const updateSelectFieldSchema = updateBaseFieldSchema.merge(selectTypeObjectSchema).merge(
  z.object({
    options: mutateOptionSchema.array().optional(),
  }),
)
export type IUpdateSelectFieldInput = z.infer<typeof updateSelectFieldSchema>

export const selectFieldQuerySchema = baseFieldQuerySchema.merge(selectTypeObjectSchema).merge(
  z.object({
    options: optionsSchema,
  }),
)

export type ISelectFieldQuerySchema = z.infer<typeof selectFieldQuerySchema>

export const selectFieldValue = optionIdSchema.nullable()
export type ISelectFieldValue = z.infer<typeof selectFieldValue>

export const createSelectFieldValue = selectFieldValue
export type ICreateSelectFieldValue = z.infer<typeof createSelectFieldValue>

export const selectFieldQueryValue = selectFieldValue
export type ISelectFieldQueryValue = z.infer<typeof selectFieldQueryValue>

export const createSelectFieldValue_internal = z
  .object({ value: createSelectFieldValue })
  .merge(selectTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(SelectField) }))
export type ICreateSelectFieldValue_internal = z.infer<typeof createSelectFieldValue_internal>

export const reorderOptionsSchema = z.object({
  fieldId: fieldIdSchema,
  from: optionIdSchema,
  to: optionIdSchema,
})

export type IReorderOptionsSchema = z.infer<typeof reorderOptionsSchema>

export const isSelectField = z.instanceof(SelectField)

export const selectReadableValueSchema = readableOptionSchema

export type ISelectReadableValueSchema = z.infer<typeof selectReadableValueSchema>

export type ISelectField = IBaseField & {
  options: Options
}
