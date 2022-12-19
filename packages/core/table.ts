import { and } from '@egodb/domain'
import { filter, map, pipe, toArray } from '@fxts/core'
import type { Option, Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ICreateRecordInput } from './commands'
import type {
  ICreateFieldSchema,
  ICreateFieldsSchema_internal,
  ICreateFieldValueSchema_internal,
  IQuerySchemaSchema,
} from './field'
import { createFieldValueSchema_internal } from './field'
import type { IRootFilter } from './filter'
import type { Record } from './record'
import { WithRecordTableId } from './record'
import { RecordFactory } from './record/record.factory'
import { WithRecordValues } from './record/specifications/record-values.specification'
import { WithTableName } from './specifications'
import { WithFilter } from './specifications/filters.specificaiton'
import type { TableCompositeSpecificaiton } from './specifications/interface'
import type { IEditTableSchema } from './table.schema'
import type { TableId } from './value-objects'
import { TableSchema } from './value-objects'
import type { TableName } from './value-objects/table-name.vo'
import type { IQueryView, ISetFieldVisibilitySchema, ISetFieldWidthSchema, ViewFieldsOrder } from './view'
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
  public id!: TableId
  public name!: TableName
  public schema: TableSchema = new TableSchema([])
  public views: Views = new Views([])

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static empty() {
    return new Table()
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

  public getSpec(viewName?: string) {
    return this.getOrCreateDefaultView(viewName).spec
  }

  public getOrCreateDefaultView(viewName?: string): View {
    if (!viewName) {
      return this.defaultView
    }

    return this.views.getByName(viewName).unwrapOrElse(() => this.defaultView)
  }

  public setFilter(filters: IRootFilter | null, viewName?: string): Result<TableCompositeSpecificaiton, string> {
    const vn = this.getOrCreateDefaultView(viewName).name.unpack()
    const spec = new WithFilter(filters, vn)
    spec.mutate(this).unwrap()
    return Ok(spec)
  }

  public updateName(name: string): TableCompositeSpecificaiton {
    const spec = WithTableName.fromString(name)
    spec.mutate(this).unwrap()
    return spec
  }

  public edit(input: IEditTableSchema): Option<TableCompositeSpecificaiton> {
    const specs: TableCompositeSpecificaiton[] = []

    if (input.name) {
      const spec = this.updateName(input.name)
      specs.push(spec)
    }

    return and(...specs)
  }

  public getFieldsOrder(viewName?: string): ViewFieldsOrder {
    return this.getOrCreateDefaultView(viewName).fieldsOrder ?? this.schema.defaultFieldsOrder
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

    const spec = new WithRecordTableId(this.id).and(WithRecordValues.fromArray(inputs))
    return RecordFactory.create(spec).unwrap()
  }

  public createField(input: ICreateFieldSchema): TableCompositeSpecificaiton {
    const spec = this.schema.createField(input)
    spec.mutate(this).unwrap()

    return spec
  }

  public setFieldWidth(input: ISetFieldWidthSchema): TableCompositeSpecificaiton {
    const view = this.getOrCreateDefaultView(input.viewName)
    const spec = view.setFieldWidth(input.fieldName, input.width)
    spec.mutate(this)
    return spec
  }

  public setFieldVisibility(input: ISetFieldVisibilitySchema): TableCompositeSpecificaiton {
    const view = this.getOrCreateDefaultView(input.viewName)
    const spec = view.setFieldVisibility(input.fieldName, input.hidden)
    spec.mutate(this)
    return spec
  }
}
