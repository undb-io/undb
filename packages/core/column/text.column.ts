import * as z from 'zod'
import { baseColumnSchema, Column } from './column.base'

const textTypeSchema = z.literal('text')

export const textColumnSchema = baseColumnSchema

export const createTextColumnSchema = baseColumnSchema.merge(z.object({ type: textTypeSchema }))

export type ICreateTextColumn = z.infer<typeof createTextColumnSchema>

export class TextColumn extends Column {}
