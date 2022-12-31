import { and, andOptions } from '@egodb/domain'
import { filter, map, pipe, toArray } from '@fxts/core'
import type { Option, Result } from 'oxide.ts'
import { None, Ok, Some } from 'oxide.ts'
import type { ICreateRecordInput } from './commands'
import type {
  ICreateFieldSchema,
  ICreateFieldsSchema_internal,
  ICreateFieldValueSchema_internal,
  IQuerySchemaSchema,
  IReorderOptionsSchema,
} from './field'
import { createFieldValueSchema_internal, isSelectField } from './field'
import type { IRootFilter } from './filter'
import type { Record } from './record'
import { WithRecordTableId } from './record'
import { RecordFactory } from './record/record.factory'
import { WithRecordValues } from './record/specifications/record-values.specification'
import { WithTableName, WithTableView, WithViewFieldsOrder } from './specifications'
import { WithFilter } from './specifications/filters.specificaiton'
import type { TableCompositeSpecificaiton } from './specifications/interface'
import type { IEditTableSchema } from './table.schema'
import type { TableId } from './value-objects'
import { TableSchema } from './value-objects'
import type { TableName } from './value-objects/table-name.vo'
import type {
  IMoveFieldSchema,
  IQueryView,
  ISetFieldVisibilitySchema,
  ISetFieldWidthSchema,
  ISetKanbanFieldSchema,
  ISwitchDisplayTypeSchema,
  ViewFieldsOrder,
} from './view'
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

  public getOrCreateDefaultView(viewName?: string): [View, Option<TableCompositeSpecificaiton>] {
    const defaultView = this.defaultView
    if (defaultView) return [defaultView, None]

    const spec = new WithTableView(this.createDefaultView(viewName))
    spec.mutate(this)

    return [spec.view, Some(spec)]
  }

  public get defaultView(): View {
    return this.views.defaultView.unwrapOrElse(() => this.createDefaultView())
  }

  private createDefaultView(viewName?: string): View {
    return View.create({ name: viewName ?? this.name.value, displayType: defaultViewDiaplyType })
  }

  public createDefaultViews(): Views {
    return new Views([this.createDefaultView()])
  }

  public getSpec(viewName?: string) {
    return this.mustGetView(viewName).spec
  }

  public getView(viewName?: string): Option<View> {
    if (!viewName) {
      return Some(this.defaultView)
    }

    return this.views.getByName(viewName)
  }

  public getOrCreateView(viewName?: string): [View, Option<TableCompositeSpecificaiton>] {
    const view = this.views.getByName(viewName)
    if (view.isSome()) return [view.unwrap(), None]
    return this.getOrCreateDefaultView(viewName)
  }

  public mustGetView(viewName?: string): View {
    if (!viewName) {
      return this.defaultView
    }

    return this.views.getByName(viewName).unwrapOrElse(() => this.defaultView)
  }

  public setFilter(filters: IRootFilter | null, viewName?: string): Result<TableCompositeSpecificaiton, string> {
    const vn = this.mustGetView(viewName).name.unpack()
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

  public getFieldsOrder(view: View): ViewFieldsOrder {
    return view.fieldsOrder ?? this.schema.defaultFieldsOrder
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
    const [field, spec] = this.schema.createField(input)
    spec.mutate(this).unwrap()

    // add field to view order
    const viewsSpec = this.views.addField(field)

    return andOptions(Some(spec), viewsSpec).unwrap()
  }

  public setFieldWidth(input: ISetFieldWidthSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewName)
    const spec = view.setFieldWidth(input.fieldName, input.width)
    spec.mutate(this)
    return spec
  }

  public switchDisplayType(input: ISwitchDisplayTypeSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewName)
    const spec = view.switchDisplayType(input.displayType)
    spec.mutate(this)
    return spec
  }

  public setFieldVisibility(input: ISetFieldVisibilitySchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewName)
    const spec = view.setFieldVisibility(input.fieldName, input.hidden)
    spec.mutate(this)
    return spec
  }

  public setKanbanField(input: ISetKanbanFieldSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewName)
    const field = this.schema.getFieldById(input.field).unwrap()
    const spec = view.setKanbanFieldSpec(field.id)
    spec.mutate(this)
    return spec
  }

  public moveField(input: IMoveFieldSchema): TableCompositeSpecificaiton {
    const [view, viewSpec] = this.getOrCreateDefaultView(input.viewName)
    const viewFieldsOrder = this.getFieldsOrder(view).move(input.from, input.to)

    const spec = new WithViewFieldsOrder(viewFieldsOrder, view)
    spec.mutate(this)

    return andOptions(viewSpec, Some(spec)).unwrap()
  }

  public reorderOption(input: IReorderOptionsSchema): TableCompositeSpecificaiton {
    let field = this.schema.getFieldById(input.fieldId).unwrap()
    field = isSelectField.parse(field)

    const spec = field.reorder(input.from, input.to)
    spec.mutate(this)

    return spec
  }
}
