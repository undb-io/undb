import { ValueObject } from '@undb/domain'
import type { IDashboard } from './dashboard.type.js'

export class Dashboard extends ValueObject<IDashboard> {
  public get widges() {
    return this.props.widges
  }
}
