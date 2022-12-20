import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'
import { SelectField } from './select.field'

export const selectTypeSchema = z.literal('select')
export type SelectFieldType = z.infer<typeof selectTypeSchema>
const selectTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: selectTypeSchema })

export const createSelectFieldSchema = createBaseFieldsSchema.merge(selectTypeObjectSchema)
export type ICreateSelectFieldInput = z.infer<typeof createSelectFieldSchema>

export const selectFieldQuerySchema = baseFieldQuerySchema.merge(selectTypeObjectSchema)

export const selectFieldValue = z.object({
  option: z.string(),
})
export type ISelectFieldValue = z.infer<typeof selectFieldValue>

export const createSelectFieldValue = selectFieldValue
export type ICreateSelectFieldValue = z.infer<typeof createSelectFieldValue>

export const createSelectFieldValue_internal = z
  .object({ value: createSelectFieldValue })
  .merge(selectTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(SelectField) }))
export type ICreateSelectFieldValue_internal = z.infer<typeof createSelectFieldValue_internal>
