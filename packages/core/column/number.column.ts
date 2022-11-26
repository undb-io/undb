import * as z from 'zod'
import { BaseColumn, baseColumnSchema, createBaseColumnsSchema } from './column.base'

const numberTypeSchema = z.literal('number')

export const numberColumnSchema = baseColumnSchema

export const createNumberColumnSchema = createBaseColumnsSchema.merge(z.object({ type: numberTypeSchema }))

export type ICreateNumberColumn = z.infer<typeof createNumberColumnSchema>

export class NumberColumn extends BaseColumn {}
