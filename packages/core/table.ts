import type { ICreateTableInput } from './commands'
import type { ICreateTableSchemaSchema } from './value-objects'
import { TableId, TableSchema } from './value-objects'
import { TableName } from './value-objects/table-name.vo'

export class Table {
  public id: TableId
  public name: TableName
  public schema: TableSchema

  constructor(name: TableName, schema: TableSchema) {
    this.id = new TableId()
    this.name = name
    this.schema = schema
  }

  static create(input: ICreateTableInput): Table {
    return new Table(new TableName(input.name), Table.createSchema(input.schema))
  }

  static createSchema(inputs: ICreateTableSchemaSchema): TableSchema {
    return TableSchema.create(inputs)
  }
}
