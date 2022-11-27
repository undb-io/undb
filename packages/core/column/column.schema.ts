import * as z from 'zod'
import { createNumberColumnSchema, numberColumnQuerySchema, numberTypeSchema } from './number.column'
import { createTextColumnSchema, textColumnQuerySchema, textTypeSchema } from './text.column'

export const createColumnSchema = z.discriminatedUnion('type', [createTextColumnSchema, createNumberColumnSchema])

export type ICreateColumnSchema = z.infer<typeof createColumnSchema>

export const queryColumnSchema = z.discriminatedUnion('type', [textColumnQuerySchema, numberColumnQuerySchema])
export const queryColumnsSchema = z.array(queryColumnSchema)
export type IQueryColumnsSchema = z.infer<typeof queryColumnsSchema>

export const columnTypes = z.union([textTypeSchema, numberTypeSchema])
export type IColumnType = z.infer<typeof columnTypes>
