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
  ISetCalendarFieldSchema,
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
    // TODO: move to views value object
    return View.create({
      id: viewName ?? this.name.value,
      name: viewName ?? this.name.value,
      displayType: defaultViewDiaplyType,
    })
  }

  public createDefaultViews(): Views {
    return new Views([this.createDefaultView()])
  }

  public getSpec(viewId?: string) {
    return this.mustGetView(viewId).spec
  }

  public getView(viewId?: string): Option<View> {
    if (!viewId) {
      return Some(this.defaultView)
    }

    return this.views.getById(viewId)
  }

  public mustGetView(viewId?: string): View {
    if (!viewId) {
      return this.defaultView
    }

    return this.views.getById(viewId).unwrapOrElse(() => this.defaultView)
  }

  public setFilter(filters: IRootFilter | null, viewId?: string): Result<TableCompositeSpecificaiton, string> {
    const vn = this.mustGetView(viewId).name.unpack()
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
    const view = this.mustGetView(input.viewId)
    const spec = view.setFieldWidth(input.fieldId, input.width)
    spec.mutate(this)
    return spec
  }

  public switchDisplayType(input: ISwitchDisplayTypeSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewId)
    const spec = view.switchDisplayType(input.displayType)
    spec.mutate(this)
    return spec
  }

  public setFieldVisibility(input: ISetFieldVisibilitySchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewId)
    const spec = view.setFieldVisibility(input.fieldId, input.hidden)
    spec.mutate(this)
    return spec
  }

  public setKanbanField(input: ISetKanbanFieldSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewId)
    const field = this.schema.getFieldById(input.field).unwrap()
    const spec = view.setKanbanFieldSpec(field.id)
    spec.mutate(this)
    return spec
  }

  public setCalendarField(input: ISetCalendarFieldSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewId)
    const field = this.schema.getFieldById(input.field).unwrap()
    const spec = view.setCalendarFieldSpec(field.id)
    spec.mutate(this)
    return spec
  }

  public moveField(input: IMoveFieldSchema): TableCompositeSpecificaiton {
    const [view, viewSpec] = this.getOrCreateDefaultView(input.viewId)
    const viewFieldsOrder = this.getFieldsOrder(view).move(input.from, input.to)

    const spec = new WithViewFieldsOrder(viewFieldsOrder, view)
    spec.mutate(this)

    return andOptions(viewSpec, Some(spec)).unwrap()
  }

  public reorderOption(input: IReorderOptionsSchema): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(input.fieldId, SelectField).unwrap()

    const spec = field.reorder(input.from, input.to)
    spec.mutate(this)

    return spec
  }

  public createOption(fieldId: string, input: ICreateOptionSchema): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(fieldId, SelectField).unwrap()

    const spec = field.createOption(input)
    spec.mutate(this)

    return spec
  }

  public updateOption(fieldId: string, optionId: string, input: IUpdateOptionSchema): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(fieldId, SelectField).unwrap()

    const spec = field.updateOption(optionId, input)
    spec.mutate(this)

    return spec
  }

  public removeOption(fieldId: string, id: string): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(fieldId, SelectField).unwrap()

    const spec = field.removeOption(id)
    spec.mutate(this)

    return spec
  }
}
