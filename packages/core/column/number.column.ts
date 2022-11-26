import * as z from 'zod'
import { baseColumnSchema, Column } from './column.base'

const numberTypeSchema = z.literal('number')

export const numberColumnSchema = baseColumnSchema

export const createNumberColumnSchema = baseColumnSchema.merge(z.object({ type: numberTypeSchema }))

export type ICreateNumberColumn = z.infer<typeof createNumberColumnSchema>

export class NumberColumn extends Column {}
