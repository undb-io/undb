import * as z from 'zod'
import { createNumberColumnSchema } from './number.column'
import { createTextColumnSchema } from './text.column'

export * from './column.base'
export { createNumberColumnSchema, createTextColumnSchema }

export const createColumnSchema = z.discriminatedUnion('type', [createTextColumnSchema, createNumberColumnSchema])
