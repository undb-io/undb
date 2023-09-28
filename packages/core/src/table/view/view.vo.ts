import type { CompositeSpecification } from '@undb/domain'
import { and, ValueObject } from '@undb/domain'
import { isEmpty, sortBy } from 'lodash-es'
import { None, Option, Some } from 'oxide.ts'
import type { Field } from '../field/index.js'
import { FieldId } from '../field/index.js'
import type { IFilterOrGroupList, IRootFilter } from '../filter/index.js'
import { RootFilter } from '../filter/index.js'
import type { TableCompositeSpecification } from '../specifications/interface.js'
import type { VisualizationVO } from '../visualization/visualization.vo.js'
import { Calendar } from './calendar/index.js'
import { Dashboard } from './dashboard/dashboard.vo.js'
import {
  WithoutWidgetSpecification,
  WithWidgetsLayout,
  WithWidgetSpecification,
} from './dashboard/specifications/widget.specification.js'
import type { ICreateWidgetSchema, IRelayoutWidgetSchema } from './dashboard/widget.schema.js'
import { Widget } from './dashboard/widget.vo.js'
import { Gallery } from './gallery/gallery.js'
import { Gantt } from './gantt/gantt.js'
import { Kanban } from './kanban/index.js'
import type { ISortDirection } from './sort/sort.schema.js'
import { Sorts } from './sort/sorts.js'
import { WithDisplayType } from './specifications/display-type.specification.js'
import {
  WithCalendarField,
  WithFilter,
  WithGalleryField,
  WithGanttField,
  WithKanbanField,
  WithRowHeight,
  WithTreeViewField,
  WithViewFieldsOrder,
  WithViewName,
  WithViewPinnedFields,
} from './specifications/index.js'
import {
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
} from './specifications/view-field-option.specification.js'
import { TreeView } from './tree-view/index.js'
import type { IViewFieldOption } from './view-field-options.js'
import { ViewFieldOptions } from './view-field-options.js'
import { ViewFieldsOrder } from './view-fields-order.vo.js'
import { ViewId } from './view-id.vo.js'
import { ViewName } from './view-name.vo.js'
import type { IViewPinnedFields } from './view-pinned-fields.js'
import { ViewPinnedFields } from './view-pinned-fields.js'
import type { IViewRowHeight } from './view-row-height.vo.js'
import { ViewRowHeight } from './view-row-height.vo.js'
import { createViewInput_internal } from './view.schema.js'
import type { ICreateViewInput_internal, IView, IViewDisplayType } from './view.type.js'

export const defaultViewDiaplyType: IViewDisplayType = 'grid'

export class ViewVO extends ValueObject<IView> {
  public get id() {
    return this.props.id
  }

  public get name() {
    return this.props.name
  }

  public set name(name: ViewName) {
    this.props.name = name
  }

  public get showSystemFields(): boolean {
    return this.props.showSystemFields ?? false
  }

  public set showSystemFields(showSystemFields: boolean) {
    this.props.showSystemFields = showSystemFields
  }

  public get displayType() {
    return this.props.displayType
  }

  public set displayType(type: IViewDisplayType) {
    this.props.displayType = type
  }

  public get filter(): RootFilter | undefined {
    return this.props.filter
  }

  public set filter(filter: RootFilter | undefined) {
    this.props.filter = filter
  }

  public get sorts(): Sorts | undefined {
    return this.props.sorts
  }

  public set sorts(sorts: Sorts | undefined) {
    if (isEmpty(sorts)) {
      this.props.sorts = undefined
    } else {
      this.props.sorts = sorts
    }
  }

  public getFieldSort(fieldId: string): Option<ISortDirection> {
    const direction = this.sorts?.sorts.find((s) => s.fieldId === fieldId)?.direction
    return Option(direction)
  }

  public get kanban(): Option<Kanban> {
    return Option(this.props.kanban)
  }

  public set kanban(kanban: Option<Kanban>) {
    this.props.kanban = kanban.into()
  }

  public get kanbanFieldId(): Option<FieldId> {
    return this.kanban.mapOr(None, (kanban) => Option(kanban.fieldId))
  }

  public get kanbanFieldIdString() {
    return this.kanban.into()?.fieldId?.value
  }

  public set kanbanFieldIdString(fieldId: string | undefined) {
    const kanban = this.kanban.into()
    if (kanban) {
      kanban.fieldId = fieldId ? FieldId.fromString(fieldId) : undefined
    } else if (fieldId) {
      this.kanban = Some(new Kanban({ fieldId: FieldId.fromString(fieldId) }))
    }
  }

  public get calendar(): Option<Calendar> {
    return Option(this.props.calendar)
  }

  public set calendar(calendar: Option<Calendar>) {
    this.props.calendar = calendar.into()
  }

  public get calendarFieldId(): Option<FieldId> {
    return this.calendar.mapOr(None, (calendar) => Option(calendar.fieldId))
  }

  public get calendarFieldIdString() {
    return this.calendar.into()?.fieldId?.value
  }

  public set calendarFieldIdString(fieldId: string | undefined) {
    const calendar = this.calendar.into()
    if (calendar) {
      calendar.fieldId = fieldId ? FieldId.fromString(fieldId) : undefined
    } else if (fieldId) {
      this.calendar = Some(new Calendar({ fieldId: FieldId.fromString(fieldId) }))
    }
  }

  public get gantt(): Option<Gantt> {
    return Option(this.props.gantt)
  }

  public set gantt(gantt: Option<Gantt>) {
    this.props.gantt = gantt.into()
  }

  public get ganttFieldId(): Option<FieldId> {
    return this.gantt.mapOr(None, (gantt) => Option(gantt.fieldId))
  }

  public get ganttFieldIdString() {
    return this.gantt.into()?.fieldId?.value
  }

  public set ganttFieldIdString(fieldId: string | undefined) {
    const gantt = this.gantt.into()
    if (gantt) {
      gantt.fieldId = fieldId ? FieldId.fromString(fieldId) : undefined
    } else if (fieldId) {
      this.gantt = Some(new Gantt({ fieldId: FieldId.fromString(fieldId) }))
    }
  }

  public get gallery(): Option<Gallery> {
    return Option(this.props.gallery)
  }

  public set gallery(gallery: Option<Gallery>) {
    this.props.gallery = gallery.into()
  }

  public get galleryFieldId(): Option<FieldId> {
    return this.gallery.mapOr(None, (gallery) => Option(gallery.fieldId))
  }

  public get galleryFieldIdString() {
    return this.gallery.into()?.fieldId?.value
  }

  public set galleryFieldIdString(fieldId: string | undefined) {
    const gallery = this.gallery.into()
    if (gallery) {
      gallery.fieldId = fieldId ? FieldId.fromString(fieldId) : undefined
    } else if (fieldId) {
      this.gallery = Some(new Gallery({ fieldId: FieldId.fromString(fieldId) }))
    }
  }
  public get treeView(): Option<TreeView> {
    return Option(this.props.tree)
  }

  public set treeView(treeView: Option<TreeView>) {
    this.props.tree = treeView.into()
  }

  public get treeViewFieldId(): Option<FieldId> {
    return this.treeView.mapOr(None, (treeView) => Option(treeView.fieldId))
  }

  public get treeFieldIdString() {
    return this.treeView.into()?.fieldId?.value
  }

  public set treeFieldIdString(fieldId: string | undefined) {
    const treeView = this.treeView.into()
    if (treeView) {
      treeView.fieldId = fieldId ? FieldId.fromString(fieldId) : undefined
    } else if (fieldId) {
      this.treeView = Some(new TreeView({ fieldId: FieldId.fromString(fieldId) }))
    }
  }

  public getSpec(userId: string): Option<CompositeSpecification> {
    if (!this.filter) return None
    return this.filter.getSpec(userId)
  }

  public get fieldOptions() {
    return this.props.fieldOptions
  }

  public set fieldOptions(options: ViewFieldOptions) {
    this.props.fieldOptions = options
  }

  public get fieldsOrder() {
    return this.props.fieldsOrder
  }

  public set fieldsOrder(v: ViewFieldsOrder | undefined) {
    this.props.fieldsOrder = v
  }

  public get pinnedFields() {
    return this.props.pinnedFields
  }

  public set pinnedFields(pf: ViewPinnedFields | undefined) {
    this.props.pinnedFields = pf
  }

  public get rowHeight() {
    return this.props.rowHeight ?? new ViewRowHeight({ value: 'short' })
  }

  public set rowHeight(rh: ViewRowHeight | undefined) {
    this.props.rowHeight = rh
  }

  public getOrderedFields(fields: Field[]): Field[] {
    return sortBy(fields, (field) => this.fieldsOrder?.order.indexOf(field.id.value))
  }

  public getFieldOption(fieldId: string): IViewFieldOption {
    return this.fieldOptions.getOption(fieldId)
  }

  public getOrCreateFieldOption(fieldId: string): IViewFieldOption {
    return this.fieldOptions.getOrCreateOption(fieldId)
  }

  public getOrCreateKanban(): Kanban {
    const kanban = this.kanban
    if (kanban.isSome()) return kanban.unwrap()

    this.props.kanban = new Kanban({})
    return this.props.kanban
  }

  public getOrCreateGallery(): Gallery {
    const gallery = this.gallery
    if (gallery.isSome()) return gallery.unwrap()

    this.props.gallery = new Gallery({})
    return this.props.gallery
  }

  public getOrCreateCalendar(): Calendar {
    const calendar = this.calendar
    if (calendar.isSome()) return calendar.unwrap()

    this.props.calendar = new Calendar({})
    return this.props.calendar
  }

  public getOrCreateGantt(): Gantt {
    const gantt = this.gantt
    if (gantt.isSome()) return gantt.unwrap()

    this.props.gantt = new Kanban({})
    return this.props.gantt
  }

  public getOrCreateTreeView(): Kanban {
    const treeView = this.treeView
    if (treeView.isSome()) return treeView.unwrap()

    this.props.tree = new TreeView({})
    return this.props.tree
  }

  public getFieldHidden(fieldId: string): boolean {
    return this.fieldOptions.getHidden(fieldId)
  }

  public getFieldWidth(fieldId: string): number {
    return this.fieldOptions.getWidth(fieldId)
  }

  public setFieldWidth(fieldId: string, width: number): TableCompositeSpecification {
    return new WithFieldWidth(fieldId, this, width)
  }

  public updateName(name: string): TableCompositeSpecification {
    return new WithViewName(this, ViewName.create(name))
  }

  public switchDisplayType(type: IViewDisplayType): TableCompositeSpecification {
    return new WithDisplayType(this, type)
  }

  public setRowHeight(rowHeight: IViewRowHeight): TableCompositeSpecification {
    return new WithRowHeight(this, ViewRowHeight.from(rowHeight))
  }

  public setFieldVisibility(fieldId: string, hidden: boolean): TableCompositeSpecification {
    return new WithFieldVisibility(fieldId, this, hidden)
  }

  public setPinnedFields(pf: IViewPinnedFields): TableCompositeSpecification {
    return new WithViewPinnedFields(new ViewPinnedFields(pf), this)
  }

  public setKanbanFieldSpec(fieldId: FieldId): TableCompositeSpecification {
    return new WithKanbanField(this, fieldId)
  }

  public setGalleryFieldSpec(fieldId: FieldId): TableCompositeSpecification {
    return new WithGalleryField(this, fieldId)
  }

  public setGanttFieldSpec(fieldId: FieldId): TableCompositeSpecification {
    return new WithGanttField(this, fieldId)
  }

  public setCalendarFieldSpec(fieldId: FieldId): TableCompositeSpecification {
    return new WithCalendarField(this, fieldId)
  }

  public setTreeViewFieldSpec(fieldId: FieldId): TableCompositeSpecification {
    return new WithTreeViewField(this, fieldId)
  }

  public getVisibility(): Record<string, boolean> {
    const visibility: Record<string, boolean> = {}
    for (const [key, value] of this.fieldOptions.value) {
      visibility[key] = !value.hidden
    }
    return visibility
  }

  public getVisibleFields(fields: Field[]): Field[] {
    const visibility = this.getVisibility()

    // undefined 也认为是可见的
    return fields.filter((field) => visibility[field.id.value] !== false)
  }

  public get filterList(): IFilterOrGroupList {
    const filters = this.filter?.value
    if (Array.isArray(filters)) return filters
    if (filters) return [filters]
    return []
  }

  public get dashboard(): Option<Dashboard> {
    return Option(this.props.dashboard)
  }

  public set dashboard(dashboard: Option<Dashboard>) {
    this.props.dashboard = dashboard.into()
  }

  public getOrCreateDashboard(): Dashboard {
    const dashboard = this.dashboard
    if (dashboard.isSome()) return dashboard.unwrap()

    this.props.dashboard = new Dashboard({ widgets: [] })
    return this.props.dashboard
  }

  public createWidget(input: ICreateWidgetSchema): TableCompositeSpecification {
    const dashboard = this.getOrCreateDashboard()

    const widget = Widget.create(input)
    const spec = new WithWidgetSpecification(this, dashboard, widget)

    return spec
  }

  public deleteWidget(widgetId: string): TableCompositeSpecification {
    const dashboard = this.getOrCreateDashboard()

    const spec = new WithoutWidgetSpecification(this, dashboard, widgetId)

    return spec
  }

  public relayoutWidgets(widgets: IRelayoutWidgetSchema[]): TableCompositeSpecification {
    const dashboard = this.getOrCreateDashboard()

    const spec = new WithWidgetsLayout(this, dashboard, widgets)
    return spec
  }

  public getVisualization(visualizationId: string): VisualizationVO | undefined {
    const dashboard = this.dashboard.into()
    const widget = dashboard?.widgets.find((w) => w.visualization?.id.value === visualizationId)
    return widget?.visualization
  }

  public mustGetVisualization(visualizationId: string): VisualizationVO {
    const visualization = this.getVisualization(visualizationId)
    if (!visualization) throw new Error('not found visualization')
    return visualization
  }

  setFilter(filter: IRootFilter | null) {
    this.props.filter = filter ? new RootFilter(filter) : undefined
  }

  public removeField(id: FieldId): Option<TableCompositeSpecification> {
    const specs: TableCompositeSpecification[] = []
    const kanban = this.kanban.map((kanban) => kanban.removeField(id)).flatten()
    if (kanban.isSome()) {
      this.kanban = kanban
      specs.push(new WithKanbanField(this, null))
    }
    const gallery = this.gallery.map((gallery) => gallery.removeField(id)).flatten()
    if (gallery.isSome()) {
      this.gallery = gallery
      specs.push(new WithGalleryField(this, null))
    }
    const calendar = this.calendar.map((calendar) => calendar.removeField(id)).flatten()
    if (calendar.isSome()) {
      this.calendar = calendar
      specs.push(new WithKanbanField(this, null))
    }
    const treeView = this.treeView.map((view) => view.removeField(id)).flatten()
    if (treeView.isSome()) {
      this.treeView = treeView
      specs.push(new WithTreeViewField(this, null))
    }
    const dashboard = this.dashboard.map((dashboard) => dashboard)
    if (dashboard.isSome()) {
      const spec = dashboard.unwrap().removeField(id)
      if (spec.isSome()) {
        specs.push(spec.unwrap())
      }
    }

    const order = this.fieldsOrder?.remove(id.value)
    if (order?.isSome()) {
      this.fieldsOrder = order.unwrap()
      specs.push(new WithViewFieldsOrder(order.unwrap(), this))
    }

    const filter = this.filter?.removeField(id)
    if (filter?.isSome()) {
      this.filter = filter.unwrap()
      specs.push(new WithFilter(filter.into()?.value ?? null, this))
    }

    const options = this.fieldOptions.removeField(id)
    if (options.isSome()) {
      this.fieldOptions = options.unwrap()
      specs.push(new WithFieldOption(this, options.unwrap()))
    }

    return and(...specs)
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name.value,
      sorts: this.sorts?.toArray(),
      showSystemFields: this.showSystemFields,
      kanban: this.kanban?.into()?.toJSON(),
      gallery: this.gallery?.into()?.toJSON(),
      gantt: this.gantt?.into()?.toJSON(),
      calendar: this.calendar?.into()?.toJSON(),
      tree: this.treeView?.into()?.toJSON(),
      dashboard: this.dashboard?.into()?.toJSON(),
      displayType: this.displayType,
      filter: this.filter?.toJSON(),
      fieldOptions: this.fieldOptions.toJSON(),
      fieldsOrder: this.fieldsOrder?.toJSON(),
      pinnedFields: this.pinnedFields?.toJSON(),
      rowHeight: this.rowHeight?.unpack(),
    }
  }

  duplicate(input: Partial<ICreateViewInput_internal>): ViewVO {
    const newView = ViewVO.create({
      ...this.toJSON(),
      ...input,
      id: ViewId.createId(),
    })

    return newView
  }

  static create(input: ICreateViewInput_internal): ViewVO {
    const parsed = createViewInput_internal.parse(input)
    const viewName = ViewName.create(parsed.name)
    return new ViewVO({
      id: input.id ? ViewId.fromString(input.id) : ViewId.create(),
      name: viewName,
      showSystemFields: input.showSystemFields,
      sorts: input.sorts ? new Sorts(input.sorts) : undefined,
      kanban: input.kanban ? Kanban.from(input.kanban) : undefined,
      gallery: input.gallery ? Gallery.from(input.gallery) : undefined,
      gantt: input.gantt ? Gantt.from(input.gantt) : undefined,
      calendar: input.calendar ? Calendar.from(input.calendar) : undefined,
      tree: input.tree ? TreeView.from(input.tree) : undefined,
      displayType: parsed.displayType || defaultViewDiaplyType,
      filter: parsed.filter ? new RootFilter(parsed.filter) : undefined,
      fieldOptions: ViewFieldOptions.from(input.fieldOptions),
      fieldsOrder: input.fieldsOrder?.length ? ViewFieldsOrder.fromArray(input.fieldsOrder) : undefined,
      pinnedFields: input.pinnedFields ? new ViewPinnedFields(input.pinnedFields) : undefined,
      rowHeight: input.rowHeight ? ViewRowHeight.from(input.rowHeight) : undefined,
      dashboard: input.dashboard ? Dashboard.from(input.dashboard) : undefined,
    })
  }
}
