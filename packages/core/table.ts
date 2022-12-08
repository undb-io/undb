import { filter, map, pipe, toArray } from '@fxts/core'
import type { ICreateRecordInput } from './commands'
import type { ICreateFieldsSchema_internal, ICreateFieldValueSchema_internal, IQuerySchemaSchema } from './field'
import { createFieldValueSchema_internal } from './field'
import { Record } from './record'
import type { ICreateTableInput_internal } from './table.schema'
import { TableId, TableSchema } from './value-objects'
import { TableName } from './value-objects/table-name.vo'
import type { IQueryView } from './view'
import { defaultViewDiaplyType, View } from './view'
import { Views } from './view/views'

/**
 * QueryTable
 */
export interface IQueryTable {
  id: string
  name: string
  schema: IQuerySchemaSchema
  views?: IQueryView[]
}

export class Table {
  public id: TableId
  public name: TableName
  public schema: TableSchema
  public views: Views

  constructor(id = TableId.create(), name: TableName, schema: TableSchema, views?: Views) {
    this.id = id
    this.name = name
    this.schema = schema
    this.views = views?.views.length ? views : this.createDefaultViews()
  }

  static create(input: ICreateTableInput_internal): Table {
    return new Table(
      TableId.fromOrCreate(input.id),
      TableName.create(input.name),
      TableSchema.create(input.schema),
      Views.create(input.views),
    )
  }

  static unsafeCreate(input: ICreateTableInput_internal): Table {
    return new Table(
      TableId.fromOrCreate(input.id),
      TableName.unsafeCreate(input.name),
      TableSchema.unsafeCreate(input.schema),
      Views.create(input.views),
    )
  }

  static fromQuery(q: IQueryTable): Table {
    return this.unsafeCreate({
      id: q.id,
      name: q.name,
      schema: q.schema,
      views: q.views,
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
      views: this.views.views.map((v) => ({
        name: v.name.unpack(),
        displayType: v.displayType,
      })),
    }
  }

  public get defaultView(): View {
    return this.views.defaultView.unwrapOrElse(() => this.createDefaultView())
  }

  private createDefaultView(): View {
    return View.create({ name: this.name.value, displayType: defaultViewDiaplyType })
  }

  public createDefaultViews(): Views {
    return new Views([this.createDefaultView()])
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
