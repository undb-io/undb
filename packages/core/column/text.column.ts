import * as z from 'zod'
import { BaseColumn, baseColumnQuerySchema, createBaseColumnsSchema } from './column.base'
import type { ITextColumn } from './column.type'
import { ColumnName, ColumnValueConstraints } from './value-objects'

export const textTypeSchema = z.literal('text')
export type TextColumnType = z.infer<typeof textTypeSchema>

export const createTextColumnSchema = createBaseColumnsSchema.merge(
  z.object({
    type: textTypeSchema,
  }),
)

export type ICreateTextColumnInput = z.infer<typeof createTextColumnSchema>

export const textColumnQuerySchema = baseColumnQuerySchema.merge(z.object({ type: textTypeSchema }))

export class TextColumn extends BaseColumn<ITextColumn> {
  get type(): TextColumnType {
    return 'text'
  }

  static create(input: ICreateTextColumnInput): TextColumn {
    return new TextColumn({
      name: ColumnName.create(input.name),
      valueConstrains: ColumnValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateTextColumnInput): TextColumn {
    return new TextColumn({
      name: ColumnName.unsafaCreate(input.name),
      valueConstrains: ColumnValueConstraints.unsafeCreate({ required: input.required }),
    })
  }
}
