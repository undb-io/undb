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
import { MultiSelectField } from './multi-select-field.js'

export const multiSelectTypeSchema = z.literal('multi-select')
export type MultiSelectFieldType = z.infer<typeof multiSelectTypeSchema>
const multiSelectTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: multiSelectTypeSchema })

export const createMultiSelectFieldSchema = createBaseFieldSchema.merge(multiSelectTypeObjectSchema).merge(
  z.object({
    options: createOptionsSchema.min(1),
  }),
)
export type ICreateMultiSelectFieldSchema = z.infer<typeof createMultiSelectFieldSchema>

export const updateMultiSelectFieldSchema = updateBaseFieldSchema.merge(multiSelectTypeObjectSchema).merge(
  z.object({
    options: mutateOptionSchema.array().optional(),
  }),
)
export type IUpdateMultiSelectFieldInput = z.infer<typeof updateMultiSelectFieldSchema>

export const multiSelectFieldQuerySchema = baseFieldQuerySchema.merge(multiSelectTypeObjectSchema).merge(
  z.object({
    options: optionsSchema,
  }),
)

export type IMultiSelectFieldQuerySchema = z.infer<typeof multiSelectFieldQuerySchema>

export const multiSelectFieldValue = optionIdSchema.array().nullable()
export type IMultiSelectFieldValue = z.infer<typeof multiSelectFieldValue>

export const createMultiSelectFieldValue = multiSelectFieldValue
export type ICreateMultiSelectFieldValue = z.infer<typeof createMultiSelectFieldValue>

export const multiSelectFieldQueryValue = multiSelectFieldValue
export type IMultiSelectFieldQueryValue = z.infer<typeof multiSelectFieldQueryValue>

export const createMultiSelectFieldValue_internal = z
  .object({ value: createMultiSelectFieldValue })
  .merge(multiSelectTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(MultiSelectField) }))
export type ICreateMultiSelectFieldValue_internal = z.infer<typeof createMultiSelectFieldValue_internal>

export const isMultiSelectField = z.instanceof(MultiSelectField)

export const multiSelectReadableValueSchema = readableOptionSchema.array()

export type IMultiSelectReadableValueSchema = z.infer<typeof multiSelectReadableValueSchema>

export type IMultiSelectField = IBaseField & { options: Options }
