import { ValueObject } from '@undb/domain'
import type { IDashboard, IDashboardSchema } from './dashboard.type.js'
import { Widge } from './widge.vo.js'

export class Dashboard extends ValueObject<IDashboard> {
  public get widges() {
    return this.props.widges
  }

  static from(input: IDashboardSchema): Dashboard {
    return new Dashboard({
      widges: input.widges.map((widge) => Widge.create(widge)),
    })
  }
}
