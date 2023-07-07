import { and, andOptions } from '@undb/domain'
import { difference, isEmpty, isEqual, isString, sortBy } from 'lodash-es'
import type { Option, Result } from 'oxide.ts'
import { None, Ok, Some } from 'oxide.ts'
import { FieldNotFoundException } from './field/field.errors.js'
import type {
  Field,
  ICreateFieldSchema,
  IDuplicatedFieldSchema,
  IQuerySchemaSchema,
  IReorderOptionsSchema,
  IUpdateFieldSchema,
} from './field/index.js'
import { FieldId, SelectField, WithDuplicatedField } from './field/index.js'
import { UpdateFieldHelper } from './field/update-field.helper.js'
import type { IRootFilter } from './filter/index.js'
import type { IQueryForm } from './form/form.type.js'
import { Forms } from './form/forms.js'
import type { ICreateOptionSchema, IUpdateOptionSchema } from './option/index.js'
import type { Record, Records } from './record/index.js'
import { WithRecordId, WithRecordTableId } from './record/index.js'
import { RecordFactory } from './record/record.factory.js'
import type { IMutateRecordValueSchema } from './record/record.schema.js'
import { createRecordInputs } from './record/record.utils.js'
import { WithRecordValues } from './record/specifications/record-values.specification.js'
import { WithTableEmoji, WithTableName } from './specifications/index.js'
import type { TableCompositeSpecificaiton } from './specifications/interface.js'
import type { IUpdateTableSchema } from './table.schema.js'
import type { IUpdateTableSchemaSchema, TableId } from './value-objects/index.js'
import { TableSchema } from './value-objects/index.js'
import type { TableEmoji } from './value-objects/table-emoji.vo.js'
import type { TableName } from './value-objects/table-name.vo.js'
import type {
  ICreateViewSchema,
  ICreateWidgetSchema,
  IMoveFieldSchema,
  IMoveViewSchema,
  IQueryView,
  IRelayoutWidgetSchema,
  ISetCalendarFieldSchema,
  ISetFieldVisibilitySchema,
  ISetFieldWidthSchema,
  ISetGanttFieldSchema,
  ISetKanbanFieldSchema,
  ISetPinnedFieldsSchema,
  ISetRowHeight,
  ISetTreeViewFieldSchema,
  ISortDirection,
  ISorts,
  ISwitchDisplayTypeSchema,
  IUpdateViewNameSchema,
  IUpdateVisualizationSchema,
  ViewFieldsOrder,
} from './view/index.js'
import {
  Sorts,
  ViewVO,
  ViewsOrder,
  VisualizationName,
  WithChartAggregateSpec,
  WithNumberAggregateSpec,
  WithShowSystemFieldsSpec,
  WithTableView,
  WithViewFieldsOrder,
  WithViewsOrder,
  WithVisualizationNameSpec,
  defaultViewDiaplyType,
} from './view/index.js'
import { WithFilter } from './view/specifications/filters.specificaiton.js'
import { WithSorts } from './view/specifications/sorts.specification.js'
import { ViewId } from './view/view-id.vo.js'
import { Views } from './view/views.js'

/**
 * QueryTable
 */
export interface IQueryTable {
  id: string
  name: string
  emoji?: string | null
  schema: IQuerySchemaSchema
  views?: IQueryView[]
  forms?: IQueryForm[]
  viewsOrder?: string[]
}

export class Table {
  public id!: TableId
  public name!: TableName
  public emoji!: TableEmoji

  public schema: TableSchema = new TableSchema([])

  public views: Views = new Views([])
  public viewsOrder: ViewsOrder = ViewsOrder.empty()

  public forms: Forms = new Forms([])

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static empty() {
    return new Table()
  }

  public getOrCreateDefaultView(viewName?: string): [ViewVO, Option<TableCompositeSpecificaiton>] {
    const defaultView = this.defaultView
    if (defaultView) return [defaultView, None]

    const spec = new WithTableView(this.createDefaultView(viewName))
    spec.mutate(this)

    return [spec.view, Some(spec)]
  }

  public get defaultView(): ViewVO {
    return this.views.defaultView.unwrapOrElse(() => this.createDefaultView())
  }

  public get orderedViews(): ViewVO[] {
    const viewsOrder = this.viewsOrder.unpack() ?? []
    return sortBy(this.views.views, (view) => viewsOrder.indexOf(view.id.value)) ?? []
  }

  private createDefaultView(viewName?: string): ViewVO {
    return ViewVO.create({
      id: ViewId.createId(),
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

  public getView(viewId?: string): Option<ViewVO> {
    if (!viewId) {
      return Some(this.defaultView)
    }

    return this.views.getById(viewId)
  }

  public mustGetView(viewId?: string): ViewVO {
    if (!viewId) {
      return this.defaultView
    }

    return this.views.getById(viewId).unwrapOrElse(() => this.defaultView)
  }

  public setFilter(filters: IRootFilter | null, viewId?: string): Result<TableCompositeSpecificaiton, string> {
    const view = this.mustGetView(viewId)
    const spec = new WithFilter(filters, view)
    spec.mutate(this).unwrap()
    return Ok(spec)
  }

  public setSorts(sorts: ISorts | null, viewId?: string): Result<TableCompositeSpecificaiton, string> {
    const view = this.mustGetView(viewId)
    const spec = new WithSorts(new Sorts(sorts ?? []), view)
    spec.mutate(this).unwrap()
    return Ok(spec)
  }

  public setFieldSort(
    fieldId: string,
    direction: ISortDirection,
    viewId?: string,
  ): Result<TableCompositeSpecificaiton, string> {
    const view = this.mustGetView(viewId)
    const sorts = view.sorts?.setFieldSort(fieldId, direction) ?? new Sorts([{ fieldId, direction }])
    const spec = new WithSorts(sorts, view)
    spec.mutate(this).unwrap()
    return Ok(spec)
  }

  public resetFieldSort(fieldId: string, viewId?: string): Result<TableCompositeSpecificaiton, string> {
    const view = this.mustGetView(viewId)
    const sorts = view.sorts?.resetFieldSort(fieldId) ?? new Sorts([])
    const spec = new WithSorts(sorts, view)
    spec.mutate(this).unwrap()
    return Ok(spec)
  }

  public updateName(name: string): TableCompositeSpecificaiton {
    const spec = WithTableName.fromString(name)
    spec.mutate(this).unwrap()
    return spec
  }

  public updateEmoji(emoji: string): TableCompositeSpecificaiton {
    const spec = WithTableEmoji.fromString(emoji)
    spec.mutate(this).unwrap()
    return spec
  }

  public updateSchema(schema: IUpdateTableSchemaSchema): TableCompositeSpecificaiton {
    const specs: TableCompositeSpecificaiton[] = []
    for (const field of schema) {
      const isNew = !field.id || !this.schema.fieldsIds.includes(field.id)
      if (isNew) {
        const spec = this.createField(undefined, field)
        specs.push(spec)
        continue
      }

      const existing = this.schema.getFieldById(field.id ?? '').into(undefined)
      if (existing) {
        const isUpdated = !isEqual(existing.json, field)
        if (isUpdated) {
          const spec = this.updateField(existing.id.value, field).unwrap()
          specs.push(spec)
          continue
        }
      }
    }
    const ids = schema.map((s) => s.id)

    const deletedFields = this.schema.fields.filter((field) => !field.isSystem() && !ids.includes(field.id.value))

    for (const field of deletedFields) {
      const spec = this.removeField(field.id.value)
      specs.push(spec)
    }

    return and(...specs).unwrap()
  }

  public update(input: IUpdateTableSchema): Option<TableCompositeSpecificaiton> {
    const specs: TableCompositeSpecificaiton[] = []

    if (isString(input.name)) {
      const spec = this.updateName(input.name)
      specs.push(spec)
    }
    if (isString(input.emoji)) {
      const spec = this.updateEmoji(input.emoji)
      specs.push(spec)
    }

    if (Array.isArray(input.schema) && !isEmpty(input.schema)) {
      const spec = this.updateSchema(input.schema)
      specs.push(spec)
    }

    return and(...specs)
  }

  private mustGetFielsOrder(view: ViewVO): ViewFieldsOrder {
    return view.fieldsOrder ?? this.schema.defaultFieldsOrder
  }

  public getFieldsOrder(view: ViewVO): string[] {
    let { order } = this.mustGetFielsOrder(view)
    const pinnedFields = view.pinnedFields
    const left = pinnedFields?.left ?? []
    const right = pinnedFields?.right ?? []
    if (!view.showSystemFields) {
      const schema = this.schema.toIdMap()
      order = order.filter((fieldId) => !schema.get(fieldId)?.system)
    }

    return [...left, ...difference(order, left.concat(right)), ...right]
  }

  public getOrderedFields(view: ViewVO = this.mustGetView(), withHidden = true): Field[] {
    const order = this.getFieldsOrder(view)
    const schema = this.schema.toIdMap()

    const fields = order.map((fieldId) => schema.get(fieldId)).filter(Boolean) as Field[]
    if (!withHidden) {
      const visibility = view.getVisibility()
      return fields.filter((f) => visibility[f.id.value] === undefined || !!visibility[f.id.value])
    }
    return fields
  }

  public createRecord(id: string | undefined, value: IMutateRecordValueSchema): Record {
    const inputs = createRecordInputs(this.schema, value)
    const spec = new WithRecordTableId(this.id)
      .and(WithRecordId.fromNullableString(id))
      .and(WithRecordValues.fromArray(inputs))
    return RecordFactory.create(spec).unwrap()
  }

  public createRecords(values: { id?: string; values: IMutateRecordValueSchema }[]): Records {
    return values.map((value) => this.createRecord(value.id, value.values))
  }

  public createField(viewId: string | undefined, input: ICreateFieldSchema, at?: number): TableCompositeSpecificaiton {
    const specs: Option<TableCompositeSpecificaiton>[] = []
    const newFieldSpecs = this.schema.createField(input)

    const selectedView = this.mustGetView(viewId)

    for (const spec of newFieldSpecs) {
      for (const view of this.views.views) {
        const viewFieldsOrder = this.mustGetFielsOrder(view).addAt(
          spec.field.id.value,
          view.id.equals(selectedView.id) ? at : undefined,
        )
        const vo = new WithViewFieldsOrder(viewFieldsOrder, view)
        vo.mutate(this).unwrap()
        specs.push(Some(vo))
      }

      spec.mutate(this).unwrap()
      specs.push(Some(spec))
    }

    return andOptions(...specs).unwrap()
  }

  public updateField(id: string, input: IUpdateFieldSchema): Option<TableCompositeSpecificaiton> {
    const field = this.schema.getFieldById(id).unwrap()

    if (input.type && field.type !== input.type) {
      return UpdateFieldHelper.updateField(field, input)
    }

    return field.update(input as any)
  }

  public duplicateField({ id, includesValues }: IDuplicatedFieldSchema): TableCompositeSpecificaiton {
    const field = this.schema.getFieldById(id).into()
    if (!field) throw new FieldNotFoundException()

    const duplicated = field.duplicate(this.schema.getNextFieldName(field.name.value))
    const spec = new WithDuplicatedField(duplicated, field, includesValues)
    const specs: Option<TableCompositeSpecificaiton>[] = [Some(spec)]
    for (const view of this.views.views) {
      const viewFieldsOrder = this.mustGetFielsOrder(view).addAt(duplicated.id.value, undefined)
      const vo = new WithViewFieldsOrder(viewFieldsOrder, view)
      vo.mutate(this).unwrap()
      specs.push(Some(vo))
    }

    return andOptions(...specs).unwrap()
  }

  public removeField(id: string): TableCompositeSpecificaiton {
    const spec = this.schema.removeField(id)
    spec.mutate(this).unwrap()

    const viewsSpec = this.views.removeField(FieldId.fromString(id))

    return andOptions(Some(spec), viewsSpec).unwrap()
  }

  public createView(input: ICreateViewSchema): TableCompositeSpecificaiton {
    const s1 = this.views.createView(input)
    const s2 = this.viewsOrder.addView(s1.view)
    const spec = s1.and(s2)
    spec.mutate(this).unwrap()

    return spec
  }

  public createWidget(viewId: string, input: ICreateWidgetSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(viewId)

    const spec = view.createWidget(input)
    spec.mutate(this)

    return spec
  }

  public deleteWidget(viewId: string, widgetId: string): TableCompositeSpecificaiton {
    const view = this.mustGetView(viewId)

    const spec = view.deleteWidget(widgetId)
    spec.mutate(this)

    return spec
  }

  public duplicateView(id: string): TableCompositeSpecificaiton {
    const s1 = this.views.duplcateView(id)
    const s2 = this.viewsOrder.addView(s1.view)
    const spec = s1.and(s2)
    spec.mutate(this).unwrap()

    return spec
  }

  public updateViewName(input: IUpdateViewNameSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.id)
    const spec = view.updateName(input.name)
    spec.mutate(this).unwrap()

    return spec
  }

  public removeView(id: string): TableCompositeSpecificaiton {
    const s1 = this.views.removeView(id)
    const s2 = this.viewsOrder.removeView(s1.view)
    const spec = andOptions(Some(s1), s2)
    spec.into()?.mutate(this).unwrap()

    return spec.unwrap()
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

  public setRowHeight(input: ISetRowHeight): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewId)
    const spec = view.setRowHeight(input.rowHeight)
    spec.mutate(this)
    return spec
  }

  public setFieldVisibility(input: ISetFieldVisibilitySchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewId)
    const spec = view.setFieldVisibility(input.fieldId, input.hidden)
    spec.mutate(this)
    return spec
  }

  public setPinnedFields(input: ISetPinnedFieldsSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewId)
    const spec = view.setPinnedFields(input.pinnedFields)
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

  public setGanttField(input: ISetGanttFieldSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewId)
    const field = this.schema.getFieldById(input.field).unwrap()
    const spec = view.setGanttFieldSpec(field.id)
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

  public setTreeViewField(input: ISetTreeViewFieldSchema): TableCompositeSpecificaiton {
    const view = this.mustGetView(input.viewId)
    const field = this.schema.getFieldById(input.field).unwrap()
    const spec = view.setTreeViewFieldSpec(field.id)
    spec.mutate(this)
    return spec
  }

  public setShowSystemFields(viewId: string | undefined, showSystemFields: boolean): TableCompositeSpecificaiton {
    const view = this.mustGetView(viewId)
    const spec = new WithShowSystemFieldsSpec(view, showSystemFields)
    spec.mutate(this)
    return spec
  }

  public moveView(input: IMoveViewSchema): TableCompositeSpecificaiton {
    const moved = this.viewsOrder.move(input.from, input.to)
    return WithViewsOrder.fromArray(moved.order)
  }

  public moveField(input: IMoveFieldSchema): TableCompositeSpecificaiton {
    const [view, viewSpec] = this.getOrCreateDefaultView(input.viewId)
    const viewFieldsOrder = this.mustGetFielsOrder(view).move(input.from, input.to)

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

  public updateOption(fieldId: string, optionKey: string, input: IUpdateOptionSchema): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(fieldId, SelectField).unwrap()

    const spec = field.updateOption(optionKey, input)
    spec.mutate(this)

    return spec
  }

  public removeOption(fieldId: string, id: string): TableCompositeSpecificaiton {
    const field = this.schema.getFieldByIdOfType(fieldId, SelectField).unwrap()

    const spec = field.removeOption(id)
    spec.mutate(this)

    return spec
  }

  public relayoutWidgets(viewId: string, widgets: IRelayoutWidgetSchema[]): TableCompositeSpecificaiton {
    const view = this.mustGetView(viewId)

    const spec = view.relayoutWidgets(widgets)
    spec.mutate(this)

    return spec
  }

  public updateVisualization(input: IUpdateVisualizationSchema): TableCompositeSpecificaiton {
    const specs: TableCompositeSpecificaiton[] = []
    if (isString(input.name)) {
      const spec = new WithVisualizationNameSpec(input.id, new VisualizationName({ value: input.name }))
      specs.push(spec)
    }

    if (input.type === 'number') {
      const spec = WithNumberAggregateSpec.from(input.id, input.fieldId, input.numberAggregateFunction)
      specs.push(spec)
    } else if (input.type === 'chart') {
      if (isString(input.fieldId) && isString(input.chartAggregateFunction)) {
        const spec = WithChartAggregateSpec.from(input.id, input.fieldId, input.chartAggregateFunction)
        specs.push(spec)
      }
    }

    return and(...specs).unwrap()
  }
}
