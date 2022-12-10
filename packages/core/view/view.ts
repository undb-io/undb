import { ValueObject } from '@egodb/domain'
import type { IFilters } from '../filter'
import { Filters } from '../filter'
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

  public get filters() {
    return this.props.filters
  }

  setFilters(filters?: IFilters) {
    this.props.filters = filters ? new Filters(filters) : undefined
  }

  static create(input: ICreateViewInput_internal): View {
    const parsed = createViewInput_internal.parse(input)
    return new View({
      name: ViewName.create(parsed.name),
      displayType: parsed.displayType || defaultViewDiaplyType,
      filters: parsed.filters ? new Filters(parsed.filters) : undefined,
    })
  }
}
