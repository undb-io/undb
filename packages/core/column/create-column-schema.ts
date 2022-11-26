import * as z from 'zod'
import { createNumberColumnSchema } from './number.column'
import { createTextColumnSchema } from './text.column'

export const createColumnSchema = z.discriminatedUnion('type', [createTextColumnSchema, createNumberColumnSchema])

export type ICreateColumnSchema = z.infer<typeof createColumnSchema>
