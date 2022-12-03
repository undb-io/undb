import * as z from 'zod'
import { createNumberFieldSchema, numberFieldQuerySchema, numberFieldValue, numberTypeSchema } from './number.field'
import { createTextFieldSchema, textFieldQuerySchema, textFieldValue, textTypeSchema } from './text.field'

export const createFieldSchema = z.discriminatedUnion('type', [createTextFieldSchema, createNumberFieldSchema])

export type ICreateFieldSchema = z.infer<typeof createFieldSchema>

export const queryFieldSchema = z.discriminatedUnion('type', [textFieldQuerySchema, numberFieldQuerySchema])
export type IQueryFieldSchema = z.infer<typeof queryFieldSchema>
export const querySchemaSchema = z.array(queryFieldSchema)
export type IQuerySchemaSchema = z.infer<typeof querySchemaSchema>

export const fieldTypes = z.union([textTypeSchema, numberTypeSchema])
export type IFieldType = z.infer<typeof fieldTypes>

export const fieldValue = z.union([textFieldValue, numberFieldValue])
export type IFieldValue = z.infer<typeof fieldValue>
