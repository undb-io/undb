import type { ICreateTableInput } from './commands'
import { TableId, TableSchema } from './value-objects'
import { TableName } from './value-objects/table-name.vo'

export class Table {
  public id: TableId
  public name: TableName
  public schema: TableSchema

  constructor(id = TableId.create(), name: TableName, schema: TableSchema) {
    this.id = id
    this.name = name
    this.schema = schema
  }

  static create(input: ICreateTableInput): Table {
    return new Table(TableId.fromOrCreate(input.id), TableName.create(input.name), TableSchema.create(input.schema))
  }

  static unsafeCreate(input: ICreateTableInput): Table {
    return new Table(
      TableId.fromOrCreate(input.id),
      TableName.unsafeCreate(input.name),
      TableSchema.unsafeCreate(input.schema),
    )
  }
}
