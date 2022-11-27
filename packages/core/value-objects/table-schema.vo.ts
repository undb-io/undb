import { ValueObject } from '@egodb/domain'
import * as z from 'zod'
import type { Column } from '../column'
import { createColumnSchema } from '../column'
import { ColumnFactory } from '../column/column.factory'

export const createTableSchemaSchema = z.array(createColumnSchema)
// .min(1, { message: 'create table required at least one schema field' })

export type ICreateTableSchemaInput = z.infer<typeof createTableSchemaSchema>

export class TableSchema extends ValueObject<Column[]> {
  constructor(props: Column[]) {
    super(props)
  }

  static create(inputs: ICreateTableSchemaInput): TableSchema {
    const columns = inputs.map(ColumnFactory.create)
    return new TableSchema(columns)
  }

  static unsafeCreate(inputs: ICreateTableSchemaInput): TableSchema {
    const columns = inputs.map(ColumnFactory.unsafeCreate)
    return new TableSchema(columns)
  }

  public get columns(): Column[] {
    return this.props
  }
}
