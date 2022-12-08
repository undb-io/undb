import { ValueObject } from '@egodb/domain'
import { ViewName } from './view-name.vo'
import { createViewInput_internal } from './view.schema'
import type { ICreateViewInput_internal, IView, IViewDisplayType } from './view.type'

export const defaultViewDiaplyType: IViewDisplayType = 'grid'

export class View extends ValueObject<IView> {
  public name: ViewName
  public displayType: IViewDisplayType

  constructor(view: IView) {
    super(view)
    this.name = view.name
    this.displayType = view.displayType
  }

  static create(input: ICreateViewInput_internal): View {
    const parsed = createViewInput_internal.parse(input)
    return new View({
      name: ViewName.create(parsed.name),
      displayType: parsed.displayType || defaultViewDiaplyType,
    })
  }
}
