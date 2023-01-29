import * as z from 'zod'
import { recordIdSchema } from '../record/value-objects/record-id.schema'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'
import { TreeField } from './tree-field'
import { fieldIdSchema } from './value-objects/field-id.schema'

export const treeTypeSchema = z.literal('tree')
export type TreeFieldType = z.infer<typeof treeTypeSchema>
const treeTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: treeTypeSchema })

export const createTreeFieldSchema = createBaseFieldsSchema
  .merge(treeTypeObjectSchema)
  .merge(z.object({ parentFieldId: fieldIdSchema.optional() }))
export type ICreateTreeFieldSchema = z.infer<typeof createTreeFieldSchema>

export const treeFieldQuerySchema = baseFieldQuerySchema
  .merge(treeTypeObjectSchema)
  .merge(z.object({ parentFieldId: fieldIdSchema }))
export type ITreeFieldQuerySchema = z.infer<typeof treeFieldQuerySchema>

export const treeFieldValue = recordIdSchema.array().nullable()
export type ITreeFieldValue = z.infer<typeof treeFieldValue>

export const createTreeFieldValue = treeFieldValue
export type ICreateTreeFieldValue = z.infer<typeof createTreeFieldValue>

export const createTreeFieldValue_internal = z
  .object({ value: createTreeFieldValue })
  .merge(treeTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(TreeField) }))
export type ICreateTreeFieldValue_internal = z.infer<typeof createTreeFieldValue_internal>
