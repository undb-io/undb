import { filter, map, pipe, toArray } from '@fxts/core'
import type { ICreateRecordInput } from './commands'
import type { ICreateFieldsSchema_internal, ICreateFieldValueSchema_internal } from './field'
import { createFieldValueSchema_internal } from './field'
import { Record } from './record'
import type { ICreateTableInput_internal } from './table.schema'
import type { IQueryTable } from './table.type'
import { TableId, TableSchema } from './value-objects'
import { TableName } from './value-objects/table-name.vo'
import { defaultViewDiaplyType, View } from './view'

export class Table {
  public id: TableId
  public name: TableName
  public schema: TableSchema
  public defaultView: View

  constructor(id = TableId.create(), name: TableName, schema: TableSchema, defaultView?: View) {
    this.id = id
    this.name = name
    this.schema = schema
    this.defaultView = defaultView ?? this.createDefaultView()
  }

  static create(input: ICreateTableInput_internal): Table {
    return new Table(
      TableId.fromOrCreate(input.id),
      TableName.create(input.name),
      TableSchema.create(input.schema),
      input.defaultView ? View.create(input.defaultView) : undefined,
    )
  }

  static unsafeCreate(input: ICreateTableInput_internal): Table {
    return new Table(
      TableId.fromOrCreate(input.id),
      TableName.unsafeCreate(input.name),
      TableSchema.unsafeCreate(input.schema),
      input.defaultView ? View.create(input.defaultView) : undefined,
    )
  }

  static fromQuery(q: IQueryTable): Table {
    return this.unsafeCreate({
      id: q.id,
      name: q.name,
      schema: q.schema,
      defaultView: q.defaultView,
    })
  }

  toQueryModel(): IQueryTable {
    return {
      id: this.id.value,
      name: this.name.value,
      schema: this.schema.fields.map((c) => ({
        id: c.id.value,
        name: c.name.value,
        type: c.type,
      })),
      defaultView: {
        name: this.defaultView.name.unpack(),
        displayType: this.defaultView.displayType,
      },
    }
  }
  public createDefaultView(): View {
    return View.create({ name: this.name.value, displayType: defaultViewDiaplyType })
  }

  public createRecord(input: ICreateRecordInput): Record {
    const inputs: ICreateFieldsSchema_internal = pipe(
      input.value,
      map(({ name, value }) =>
        this.schema
          .getField(name)
          .map((field) => ({ type: field.type, field, value } as ICreateFieldValueSchema_internal)),
      ),
      filter((f) => f.isSome),
      map((f) => f.unwrap()),
      map((f) => createFieldValueSchema_internal.parse(f)),
      toArray,
    )

    return Record.create({ tableId: this.id, value: inputs })
  }
}
