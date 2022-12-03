import { entries, filter, map, pipe, toArray } from '@fxts/core'
import type { ICreateRecordInput, ICreateTableInput } from './commands'
import type { ICreateFieldsSchema_internal, ICreateFieldValueSchema_internal } from './field'
import { createFieldValueSchema_internal } from './field'
import { Record } from './record'
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

  public createRecord(input: ICreateRecordInput): Record {
    const inputs: ICreateFieldsSchema_internal = pipe(
      input.value,
      entries,
      map(([name, value]) =>
        this.schema
          .getField(name)
          .map((field) => ({ type: field.type, field, value } as ICreateFieldValueSchema_internal)),
      ),
      filter((f) => f.isSome),
      map((f) => f.unwrap()),
      map((f) => createFieldValueSchema_internal.parse(f)),
      toArray,
    )

    return Record.create({ value: inputs })
  }
}
