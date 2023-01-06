import type { CompositeSpecification } from '@egodb/domain'
import { ValueObject } from '@egodb/domain'
import { None, Option } from 'oxide.ts'
import type { FieldId } from '../field'
import type { IFilterOrGroupList, IRootFilter } from '../filter'
import { RootFilter } from '../filter'
import type { TableCompositeSpecificaiton } from '../specifications/interface'
import { WithFieldVisibility, WithFieldWidth } from '../specifications/table-view-field-option.specification'
import { Calendar } from './calendar'
import { Kanban } from './kanban'
import { WithCalendarField, WithKanbanField } from './specifications'
import { WithDisplayType } from './specifications/display-type.specification'
import type { IViewFieldOption } from './view-field-options'
import { ViewFieldOptions } from './view-field-options'
import { ViewFieldsOrder } from './view-fields-order.vo'
import { ViewId } from './view-id.vo'
import { ViewName } from './view-name.vo'
import { createViewInput_internal } from './view.schema'
import type { ICreateViewInput_internal, IView, IViewDisplayType } from './view.type'

export const defaultViewDiaplyType: IViewDisplayType = 'grid'

export class View extends ValueObject<IView> {
  public get id() {
    return this.props.id
  }

  public get name() {
    return this.props.name
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

  public get kanban(): Option<Kanban> {
    return Option(this.props.kanban)
  }

  public get kanbanFieldId(): Option<FieldId> {
    return this.kanban.mapOr(None, (kanban) => Option(kanban.fieldId))
  }

  public get calendar(): Option<Kanban> {
    return Option(this.props.calendar)
  }

  public get calendarFieldId(): Option<FieldId> {
    return this.calendar.mapOr(None, (calendar) => Option(calendar.fieldId))
  }

  public get spec(): Option<CompositeSpecification> {
    if (!this.filter) return None
    return this.filter.spec
  }

  public get fieldOptions() {
    return this.props.fieldOptions
  }

  public get fieldsOrder() {
    return this.props.fieldsOrder
  }

  public set fieldsOrder(v: ViewFieldsOrder | undefined) {
    this.props.fieldsOrder = v
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

  public getOrCreateCalendar(): Kanban {
    const calendar = this.calendar
    if (calendar.isSome()) return calendar.unwrap()

    this.props.calendar = new Calendar({})
    return this.props.calendar
  }

  public getFieldHidden(fieldId: string): boolean {
    return this.fieldOptions.getHidden(fieldId)
  }

  public getFieldWidth(fieldId: string): number {
    return this.fieldOptions.getWidth(fieldId)
  }

  public setFieldWidth(fieldId: string, width: number): TableCompositeSpecificaiton {
    return new WithFieldWidth(fieldId, this.name.unpack(), width)
  }

  public switchDisplayType(type: IViewDisplayType): TableCompositeSpecificaiton {
    return new WithDisplayType(this, type)
  }

  public setFieldVisibility(fieldId: string, hidden: boolean): TableCompositeSpecificaiton {
    return new WithFieldVisibility(fieldId, this.name.unpack(), hidden)
  }

  public setKanbanFieldSpec(fieldId: FieldId): TableCompositeSpecificaiton {
    return new WithKanbanField(this, fieldId)
  }

  public setCalendarFieldSpec(fieldId: FieldId): TableCompositeSpecificaiton {
    return new WithCalendarField(this, fieldId)
  }

  public getVisibility(): Record<string, boolean> {
    const visibility: Record<string, boolean> = {}
    for (const [key, value] of this.fieldOptions.value) {
      visibility[key] = !value.hidden
    }
    return visibility
  }

  public get filterList(): IFilterOrGroupList {
    const filters = this.filter?.value
    if (Array.isArray(filters)) return filters
    if (filters) return [filters]
    return []
  }

  setFilter(filter: IRootFilter | null) {
    this.props.filter = filter ? new RootFilter(filter) : undefined
  }

  static create(input: ICreateViewInput_internal): View {
    const parsed = createViewInput_internal.parse(input)
    const viewName = ViewName.create(parsed.name)
    return new View({
      id: input.id ? ViewId.create(input.id) : ViewId.fromName(viewName),
      name: viewName,
      kanban: input.kanban ? Kanban.from(input.kanban) : undefined,
      calendar: input.calendar ? Kanban.from(input.calendar) : undefined,
      displayType: parsed.displayType || defaultViewDiaplyType,
      filter: parsed.filter ? new RootFilter(parsed.filter) : undefined,
      fieldOptions: ViewFieldOptions.from(input.fieldOptions),
      fieldsOrder: input.fieldsOrder?.length ? ViewFieldsOrder.fromArray(input.fieldsOrder) : undefined,
    })
  }
}
