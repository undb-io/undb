import { and, andOptions } from '@egodb/domain'
import type { Option, Result } from 'oxide.ts'
import { None, Ok, Some } from 'oxide.ts'
import type { ICreateFieldSchema, IQuerySchemaSchema, IReorderOptionsSchema } from './field'
import { SelectField } from './field'
import type { IRootFilter } from './filter'
import type { ICreateOptionSchema, IUpdateOptionSchema } from './option'
import type { Record } from './record'
import { WithRecordTableId } from './record'
import { RecordFactory } from './record/record.factory'
import type { IMutateRecordValueSchema } from './record/record.schema'
import { createRecordInputs } from './record/record.utils'
import { WithRecordValues } from './record/specifications/record-values.specification'
import { WithTableName } from './specifications'
import type { TableCompositeSpecificaiton } from './specifications/interface'
import type { IEditTableSchema } from './table.schema'
import type { TableId } from './value-objects'
import { TableSchema } from './value-objects'
import type { TableName } from './value-objects/table-name.vo'
import type {
  IMoveFieldSchema,
  IQueryView,
  ISetCalendarFieldSchema,
  ISetFieldVisibilitySchema,
  ISetFieldWidthSchema,
  ISetKanbanFieldSchema,
  ISwitchDisplayTypeSchema,
  ViewFieldsOrder,
} from './view'
import { defaultViewDiaplyType, View, WithTableView, WithViewFieldsOrder } from './view'
import { WithFilter } from './view/specifications/filters.specificaiton'
import { ViewId } from './view/view-id.vo'
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
    // TODO: move to views value object
    return View.create({
      id: ViewId.createId(),
      key: viewName ?? this.name.value,
      name: viewName ?? this.name.value,
      displayType: defaultViewDiaplyType,
    })
  }

  public createDefaultViews(): Views {
    return new Views([this.createDefaultView()])
  }

  public getSpec(viewKey?: string) {
    return this.mustGetView(viewKey).spec
  }

  public getView(viewKey?: string): Option<View> {
    if (!viewKey) {
      return Some(this.defaultView)
    }

    return this.views.getById(viewKey)
  }

  public mustGetView(viewKey?: string): View {
    if (!viewKey) {
      return this.defaultView
    }

    return this.views.getById(viewKey).unwrapOrElse(() => this.defaultView)
  }

  public setFilter(filters: IRootFilter | null, viewKey?: string): Result<TableCompositeSpecificaiton, string> {
    const view = this.mustGetView(viewKey)
    const spec = new WithFilter(filters, view)
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

  public createRecord(value: IMutateRecordValueSchema): Record {
    const inputs = createRecordInputs(this.schema, value)
    const spec = new WithRecordTableId(this.id).and(WithRecordValues.fromArray(inputs))
    return RecordFactory.create(spec).unwrap()
  }

  public createField(input: ICreateFieldSchema): TableCompositeSpecificaiton {
    const spec = this.schema.createField(input)
    spec.mutate(this).unwrap()

    // add field to view order
    const viewsSpec = this.views.addField(spec.field)

    return andOptions(Some(spec), viewsSpec).unwrap()
  }

  public removeField(id: string): TableCompositeSpecificaiton {
    const spec = this.schema.removeField(id)
    spec.mutate(this).unwrap()

    // remove field from view order
    const viewsSpec = this.views.removeField(spec.field)

    return andOptions(Some(spec), viewsSpec).unwrap()
  }

  public setFieldWidth(input: ISetFieldWidthSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewKey)
    const spec = view.setFieldWidth(input.fieldKey, input.width)
    spec.mutate(this)
    return spec
  }

  public switchDisplayType(input: ISwitchDisplayTypeSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewKey)
    const spec = view.switchDisplayType(input.displayType)
    spec.mutate(this)
    return spec
  }

  public setFieldVisibility(input: ISetFieldVisibilitySchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewKey)
    const spec = view.setFieldVisibility(input.fieldKey, input.hidden)
    spec.mutate(this)
    return spec
  }

  public setKanbanField(input: ISetKanbanFieldSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewKey)
    const field = this.schema.getFieldById(input.field).unwrap()
    const spec = view.setKanbanFieldSpec(field.key)
    spec.mutate(this)
    return spec
  }

  public setCalendarField(input: ISetCalendarFieldSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewKey)
    const field = this.schema.getFieldById(input.field).unwrap()
    const spec = view.setCalendarFieldSpec(field.key)
    spec.mutate(this)
    return spec
  }

  public moveField(input: IMoveFieldSchema): TableCompositeSpecificaiton {
    const [view, viewSpec] = this.getOrCreateDefaultView(input.viewKey)
    const viewFieldsOrder = this.getFieldsOrder(view).move(input.from, input.to)

    const spec = new WithViewFieldsOrder(viewFieldsOrder, view)
    spec.mutate(this)

    return andOptions(viewSpec, Some(spec)).unwrap()
  }

  public reorderOption(input: IReorderOptionsSchema): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(input.fieldKey, SelectField).unwrap()

    const spec = field.reorder(input.from, input.to)
    spec.mutate(this)

    return spec
  }

  public createOption(fieldKey: string, input: ICreateOptionSchema): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(fieldKey, SelectField).unwrap()

    const spec = field.createOption(input)
    spec.mutate(this)

    return spec
  }

  public updateOption(fieldKey: string, optionKey: string, input: IUpdateOptionSchema): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(fieldKey, SelectField).unwrap()

    const spec = field.updateOption(optionKey, input)
    spec.mutate(this)

    return spec
  }

  public removeOption(fieldKey: string, id: string): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(fieldKey, SelectField).unwrap()

    const spec = field.removeOption(id)
    spec.mutate(this)

    return spec
  }
}
