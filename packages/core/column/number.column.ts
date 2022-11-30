import * as z from 'zod'
import { BaseColumn, baseColumnQuerySchema, createBaseColumnsSchema } from './column.base'
import type { INumberColumn } from './column.type'
import { ColumnId, ColumnName, ColumnValueConstraints } from './value-objects'

export const numberTypeSchema = z.literal('number')
export type NumberType = z.infer<typeof numberTypeSchema>

export const createNumberColumnSchema = createBaseColumnsSchema.merge(z.object({ type: numberTypeSchema }))

export type ICreateNumberColumnInput = z.infer<typeof createNumberColumnSchema>

export const numberColumnQuerySchema = baseColumnQuerySchema.merge(z.object({ type: numberTypeSchema }))

export class NumberColumn extends BaseColumn<INumberColumn> {
  get type(): NumberType {
    return 'number'
  }

  static create(input: ICreateNumberColumnInput): NumberColumn {
    return new NumberColumn({
      id: ColumnId.from(input.id),
      name: ColumnName.create(input.name),
      valueConstrains: ColumnValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateNumberColumnInput): NumberColumn {
    return new NumberColumn({
      id: ColumnId.from(input.id),
      name: ColumnName.unsafaCreate(input.name),
      valueConstrains: ColumnValueConstraints.unsafeCreate({ required: input.required }),
    })
  }
}
