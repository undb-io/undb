import { ValueObject } from '@egodb/domain'
import * as z from 'zod'
import type { IColumnType } from './column.schema'
import type { IBaseColumn } from './column.type'
import type { ColumnName } from './value-objects'
import { columnNameSchema, valueConstraintsSchema } from './value-objects'

export const createBaseColumnsSchema = z
  .object({
    name: columnNameSchema,
  })
  .merge(valueConstraintsSchema)

export type IBaseCreateColumnsSchema = z.infer<typeof createBaseColumnsSchema>

export const baseColumnQuerySchema = z.object({ name: columnNameSchema }).merge(valueConstraintsSchema)

export abstract class BaseColumn<C extends IBaseColumn> extends ValueObject<C> {
  abstract type: IColumnType
  public get name(): ColumnName {
    return this.props.name
  }

  public get required(): boolean {
    return this.props.valueConstrains.required
  }
}
