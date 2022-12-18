import type { CompositeSpecification } from '@egodb/domain'
import { ValueObject } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { IFilterOrGroupList, IRootFilter } from '../filter'
import { RootFilter } from '../filter'
import { WithFieldWidth } from '../specifications'
import type { TableCompositeSpecificaiton } from '../specifications/interface'
import type { IViewFieldOption } from './view-field-options'
import { ViewFieldOptions } from './view-field-options'
import { ViewName } from './view-name.vo'
import { createViewInput_internal } from './view.schema'
import type { ICreateViewInput_internal, IView, IViewDisplayType } from './view.type'

export const defaultViewDiaplyType: IViewDisplayType = 'grid'

export class View extends ValueObject<IView> {
  public get name() {
    return this.props.name
  }

  public get displayType() {
    return this.props.displayType
  }

  public get filter(): RootFilter | undefined {
    return this.props.filter
  }

  public get spec(): Option<CompositeSpecification> {
    if (!this.filter) return None
    return this.filter.spec
  }

  public get fieldOptions() {
    return this.props.fieldOptions
  }

  public getFieldOption(fieldName: string): IViewFieldOption {
    return this.fieldOptions.getOption(fieldName)
  }

  public getOrCreateFieldOption(fieldName: string): IViewFieldOption {
    return this.fieldOptions.getOrCreateOption(fieldName)
  }

  public getFieldWidth(fieldName: string): number {
    return this.fieldOptions.getWidth(fieldName)
  }

  public setFieldWidth(fieldName: string, width: number): TableCompositeSpecificaiton {
    return new WithFieldWidth(fieldName, this.name.unpack(), width)
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
    return new View({
      name: ViewName.create(parsed.name),
      displayType: parsed.displayType || defaultViewDiaplyType,
      filter: parsed.filter ? new RootFilter(parsed.filter) : undefined,
      fieldOptions: ViewFieldOptions.from(input.fieldOptions),
    })
  }
}
