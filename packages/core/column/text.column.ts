import * as z from 'zod'
import { BaseColumn, baseColumnSchema, createBaseColumnsSchema } from './column.base'

const textTypeSchema = z.literal('text')

export const textColumnSchema = baseColumnSchema

export const createTextColumnSchema = createBaseColumnsSchema.merge(z.object({ type: textTypeSchema }))

export type ICreateTextColumn = z.infer<typeof createTextColumnSchema>

export class TextColumn extends BaseColumn {}
