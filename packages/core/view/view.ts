import type { CompositeSpecification } from '@egodb/domain'
import { ValueObject } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { IFilterOrGroupList, IRootFilter } from '../filter'
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

  public get filter(): RootFilter | undefined {
    return this.props.filter
  }

  public get spec(): Option<CompositeSpecification> {
    if (!this.filter) return None
    return this.filter.spec
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
    })
  }
}
