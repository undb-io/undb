import { ValueObject } from '@egodb/domain'
import type { IRootFilter, IRootFilterList } from '../filter'
import { RootFilter } from '../filter'
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

  public get filters(): RootFilter | undefined {
    return this.props.filters
  }

  public get filterList(): IRootFilterList {
    const filters = this.filters?.value
    if (Array.isArray(filters)) return filters
    if (filters) return [filters]
    return []
  }

  setFilters(filters: IRootFilter | null) {
    this.props.filters = filters ? new RootFilter(filters) : undefined
  }

  static create(input: ICreateViewInput_internal): View {
    const parsed = createViewInput_internal.parse(input)
    return new View({
      name: ViewName.create(parsed.name),
      displayType: parsed.displayType || defaultViewDiaplyType,
      filters: parsed.filters ? new RootFilter(parsed.filters) : undefined,
    })
  }
}
