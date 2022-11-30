import { ValueObject } from '@egodb/domain'
import * as z from 'zod'
import type { IColumnType } from './column.schema'
import type { IBaseColumn } from './column.type'
import type { ColumnName } from './value-objects'
import { columnNameSchema, valueConstraintsSchema } from './value-objects'
import type { ColumnId } from './value-objects/column-id.vo'
import { columnIdSchema } from './value-objects/column-id.vo'

export const createBaseColumnsSchema = z
  .object({
    id: columnIdSchema,
    name: columnNameSchema,
  })
  .merge(valueConstraintsSchema)

export type IBaseCreateColumnsSchema = z.infer<typeof createBaseColumnsSchema>

export const baseColumnQuerySchema = z
  .object({ id: columnIdSchema, name: columnNameSchema })
  .merge(valueConstraintsSchema)

export abstract class BaseColumn<C extends IBaseColumn> extends ValueObject<C> {
  abstract type: IColumnType
  public get id(): ColumnId {
    return this.props.id
  }
  public get name(): ColumnName {
    return this.props.name
  }

  public get required(): boolean {
    return this.props.valueConstrains.required
  }
}
